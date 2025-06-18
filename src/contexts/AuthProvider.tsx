
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

  // 🚀 Auditoria de sessão - Log detalhado
  console.debug("AuthProvider: Estado atual", { 
    hasUser: !!user, 
    hasSession: !!session,
    hasProfile: !!profile,
    sessionValid: session ? new Date(session.expires_at! * 1000) > new Date() : false,
    loading, 
    error
  });

  /**
   * ✅ TAREFA 1: Busca perfil com retry e tratamento robusto
   */
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      console.debug("🚀 Buscando perfil para userId:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("AuthProvider: Erro ao buscar perfil:", error);
        return null;
      }

      if (!data) {
        // Auto-criar perfil se não existir
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
          return null;
        }

        console.debug("🚀 Perfil criado automaticamente:", newProfile);
        return newProfile;
      }

      console.debug("🚀 Perfil carregado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("AuthProvider: Erro inesperado ao buscar perfil:", error);
      return null;
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  }, [user?.id, fetchProfile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    // ✅ TAREFA 2: Configurar listener de auth state primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.debug("🚀 Evento de auth:", event);
        console.debug("🚀 Sessão após evento:", session);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          console.debug("🚀 SIGNED_IN - Sessão válida recebida");
          setSession(session);
          setUser(session.user);
          
          // Buscar perfil sem afetar o estado de loading
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          console.debug("🚀 SIGNED_OUT ou sessão inválida");
          setSession(null);
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.debug("🚀 TOKEN_REFRESHED - Atualizando sessão");
          setSession(session);
          setUser(session.user);
        }

        // Definir loading como false após processar qualquer evento
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // ✅ TAREFA 3: Verificar sessão inicial após configurar listener
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Erro ao obter sessão inicial:", error);
          setError(`Erro de autenticação: ${error.message}`);
        } else if (session && mounted) {
          console.debug("🚀 Sessão inicial encontrada:", session);
          setSession(session);
          setUser(session.user);
          
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("AuthProvider: Erro na inicialização:", error);
        if (mounted) {
          setError("Erro ao inicializar autenticação");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Calcular trial status
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
