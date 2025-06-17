
import React, { createContext, useEffect, useState, ReactNode, useCallback } from "react";
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

  console.log("AuthProvider: Estado atual", { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    error,
    profilePlan: profile?.plan,
    trialEndsAt: profile?.trial_ends_at
  });

  /**
   * Busca o perfil do usuário com tratamento de erro robusto e retry
   */
  const fetchProfile = useCallback(async (userId: string, retryCount = 0): Promise<Profile | null> => {
    try {
      console.log("AuthProvider: Buscando perfil para userId:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        // Retry uma vez em caso de erro de rede
        if (retryCount === 0 && error.message.includes('network')) {
          console.warn("AuthProvider: Tentando novamente buscar perfil devido a erro de rede");
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, 1);
        }
        
        console.error("AuthProvider: Erro ao buscar perfil:", error);
        setError(`Erro ao carregar perfil: ${error.message}`);
        return null;
      }

      if (!data) {
        console.warn("AuthProvider: Perfil não encontrado para userId:", userId);
        // Tentar criar perfil automaticamente se não existir
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
          console.error("AuthProvider: Erro ao criar perfil:", createError);
          setError("Erro ao criar perfil do usuário");
          return null;
        }

        console.log("AuthProvider: Perfil criado automaticamente:", newProfile);
        setError(null);
        return newProfile;
      }

      console.log("AuthProvider: Perfil carregado com sucesso:", data);
      setError(null);
      return data;
    } catch (error) {
      console.error("AuthProvider: Erro inesperado ao buscar perfil:", error);
      setError("Erro inesperado ao carregar perfil do usuário");
      return null;
    }
  }, [user]);

  /**
   * Função para atualizar o perfil manualmente
   */
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user?.id, fetchProfile]);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Atualizar estado do usuário de forma segura
   */
  const updateAuthState = useCallback(async (newSession: Session | null) => {
    try {
      if (newSession?.user) {
        console.log("AuthProvider: Atualizando estado para usuário logado:", newSession.user.id);
        
        setUser(newSession.user);
        setSession(newSession);
        
        const profileData = await fetchProfile(newSession.user.id);
        setProfile(profileData);
      } else {
        console.log("AuthProvider: Limpando estado do usuário");
        setUser(null);
        setProfile(null);
        setSession(null);
        setError(null);
      }
    } catch (error) {
      console.error("AuthProvider: Erro ao atualizar estado:", error);
      setError("Erro ao atualizar estado de autenticação");
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Inicializando autenticação");
        
        authSubscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("AuthProvider: Evento de auth:", event, "Session:", !!session);
            
            if (!mounted) return;

            // Usar timeout para evitar race conditions
            setTimeout(() => {
              if (mounted) {
                updateAuthState(session);
              }
            }, 0);
          }
        );

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Erro ao obter sessão:", error);
          setError(`Erro de autenticação: ${error.message}`);
          setLoading(false);
          return;
        }

        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error("AuthProvider: Erro na inicialização:", error);
        if (mounted) {
          setError("Erro ao inicializar autenticação");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [updateAuthState]);

  // Calcular se está em período de trial e dias restantes
  const isTrialing = profile?.trial_ends_at 
    ? new Date(profile.trial_ends_at) > new Date() 
    : false;

  const trialDaysLeft = profile?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  console.log("AuthProvider: Trial status calculado", {
    isTrialing,
    trialDaysLeft,
    trialEndsAt: profile?.trial_ends_at,
    now: new Date().toISOString()
  });

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
