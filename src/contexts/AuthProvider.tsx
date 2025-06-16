
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
    error 
  });

  /**
   * Busca o perfil do usuário com tratamento de erro robusto
   */
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      console.log("AuthProvider: Buscando perfil para userId:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Usar maybeSingle para evitar erro se não encontrar

      if (error) {
        console.error("AuthProvider: Erro ao buscar perfil:", error);
        setError(`Erro ao carregar perfil: ${error.message}`);
        return null;
      }

      if (!data) {
        console.warn("AuthProvider: Perfil não encontrado para userId:", userId);
        // Não é necessariamente um erro - usuário pode não ter perfil ainda
        return null;
      }

      console.log("AuthProvider: Perfil carregado com sucesso:", data);
      setError(null); // Limpar erro anterior se existir
      return data;
    } catch (error) {
      console.error("AuthProvider: Erro inesperado ao buscar perfil:", error);
      setError("Erro inesperado ao carregar perfil do usuário");
      return null;
    }
  }, []);

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
        
        // Buscar perfil apenas se necessário
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

    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Inicializando autenticação");
        
        // Primeiro, configurar o listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("AuthProvider: Evento de auth:", event, "Session:", !!session);
            
            if (!mounted) return;

            // Usar setTimeout para evitar problemas de concorrência
            setTimeout(() => {
              if (mounted) {
                updateAuthState(session);
              }
            }, 0);
          }
        );

        // Depois, verificar sessão atual
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

        // Retornar função de cleanup
        return () => {
          subscription.unsubscribe();
        };
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
    };
  }, [updateAuthState]);

  // Calcular se está em período de trial
  const isTrialing = profile?.trial_ends_at 
    ? new Date(profile.trial_ends_at) > new Date() 
    : false;

  const contextValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isTrialing,
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
