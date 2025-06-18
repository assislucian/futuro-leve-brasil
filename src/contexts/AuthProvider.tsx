
import React, { createContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isTrialing: boolean;
  trialDaysLeft: number;
  error: string | null;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para controle de execução e prevenção de race conditions
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);

  console.log("🔐 AuthProvider: Estado atual", { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    error,
    isInitializing: initializingRef.current,
    sessionId: session?.access_token?.substring(0, 10) + '...' || 'none'
  });

  /**
   * Busca o perfil do usuário com retry inteligente e cache
   */
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!mountedRef.current) return null;
    
    try {
      console.log("🔍 AuthProvider: Buscando perfil para userId:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ AuthProvider: Erro ao buscar perfil:", error.message);
        
        // Se o perfil não existe, criar automaticamente
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              full_name: user?.user_metadata?.full_name || user?.email || 'Usuário',
              plan: 'free',
              trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select()
            .maybeSingle();

          if (createError) {
            console.error("❌ AuthProvider: Erro ao criar perfil:", createError);
            return null;
          }

          console.log("✅ AuthProvider: Perfil criado automaticamente");
          return newProfile;
        }
        
        return null;
      }

      if (!data) {
        console.warn("⚠️ AuthProvider: Perfil não encontrado, criando...");
        // Criar perfil se não existir
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: user?.user_metadata?.full_name || user?.email || 'Usuário',
            plan: 'free',
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .maybeSingle();

        if (createError) {
          console.error("❌ AuthProvider: Erro ao criar perfil:", createError);
          return null;
        }

        return newProfile;
      }

      console.log("✅ AuthProvider: Perfil carregado com sucesso");
      return data;
    } catch (error) {
      console.error("💥 AuthProvider: Erro inesperado ao buscar perfil:", error);
      return null;
    }
  }, [user]);

  /**
   * Função para atualizar o perfil manualmente
   */
  const refreshProfile = useCallback(async () => {
    if (!user?.id || loading) return;
    
    const profileData = await fetchProfile(user.id);
    if (mountedRef.current) {
      setProfile(profileData);
    }
  }, [user?.id, loading, fetchProfile]);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    if (mountedRef.current) {
      setError(null);
    }
  }, []);

  /**
   * Atualizar estado do usuário de forma segura e otimizada
   */
  const updateAuthState = useCallback(async (newSession: Session | null, skipProfile = false) => {
    if (!mountedRef.current) return;
    
    try {
      if (newSession?.user) {
        console.log("🚀 AuthProvider: Atualizando estado para usuário logado:", newSession.user.id);
        
        setUser(newSession.user);
        setSession(newSession);
        setError(null);
        
        // Buscar perfil apenas se não estiver sendo pulado
        if (!skipProfile) {
          const profileData = await fetchProfile(newSession.user.id);
          if (mountedRef.current) {
            setProfile(profileData);
          }
        }
      } else {
        console.log("🔓 AuthProvider: Limpando estado do usuário");
        setUser(null);
        setProfile(null);
        setSession(null);
        setError(null);
      }
    } catch (error) {
      console.error("💥 AuthProvider: Erro ao atualizar estado:", error);
      if (mountedRef.current) {
        setError("Erro ao atualizar estado de autenticação");
      }
    }
  }, [fetchProfile]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const initializeAuth = async () => {
      // Prevenir múltiplas inicializações simultâneas
      if (initializingRef.current || !mountedRef.current) {
        return;
      }
      
      initializingRef.current = true;
      
      try {
        console.log("🔄 AuthProvider: Inicializando autenticação...");
        
        // Configurar listener de mudanças de estado PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mountedRef.current) return;
            
            console.log("🔔 AuthProvider: Evento de auth:", event, "Session:", !!session);
            
            // Usar timeout para evitar race conditions
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
              if (mountedRef.current) {
                await updateAuthState(session, event === 'TOKEN_REFRESHED');
                
                // Definir loading como false após processar mudança de estado
                if (event !== 'TOKEN_REFRESHED') {
                  setLoading(false);
                }
              }
            }, event === 'TOKEN_REFRESHED' ? 100 : 300);
          }
        );
        
        subscriptionRef.current = subscription;

        // DEPOIS buscar sessão atual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ AuthProvider: Erro ao obter sessão:", error);
          if (mountedRef.current) {
            setError(`Erro de autenticação: ${error.message}`);
            setLoading(false);
          }
          return;
        }

        if (mountedRef.current) {
          await updateAuthState(session);
          setLoading(false);
        }
        
      } catch (error) {
        console.error("💥 AuthProvider: Erro na inicialização:", error);
        if (mountedRef.current) {
          setError("Erro ao inicializar autenticação");
          setLoading(false);
        }
      } finally {
        initializingRef.current = false;
      }
    };

    initializeAuth();

    return () => {
      clearTimeout(timeoutId);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Dependências vazias - executar apenas uma vez

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Calcular se está em período de trial e dias restantes
  const isTrialing = profile?.trial_ends_at 
    ? new Date(profile.trial_ends_at) > new Date() 
    : false;

  const trialDaysLeft = profile?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const contextValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isTrialing,
    trialDaysLeft,
    error,
    refreshProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
