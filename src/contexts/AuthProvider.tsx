
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isTrialing: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("AuthProvider: Estado atual - user:", !!user, "session:", !!session, "profile:", !!profile, "loading:", loading);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("AuthProvider: Buscando perfil para userId:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthProvider: Erro ao buscar perfil:", error);
        return null;
      }

      console.log("AuthProvider: Perfil encontrado:", data);
      return data;
    } catch (error) {
      console.error("AuthProvider: Erro inesperado ao buscar perfil:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Inicializando autenticação");
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Erro ao obter sessão:", error);
          if (mounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        if (currentSession?.user) {
          console.log("AuthProvider: Sessão encontrada para usuário:", currentSession.user.id);
          
          if (mounted) {
            setUser(currentSession.user);
            setSession(currentSession);
          }

          // Buscar perfil
          const profileData = await fetchProfile(currentSession.user.id);
          
          if (mounted) {
            setProfile(profileData);
            setLoading(false);
          }
        } else {
          console.log("AuthProvider: Nenhuma sessão encontrada");
          if (mounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("AuthProvider: Erro na inicialização:", error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("AuthProvider: Evento de auth:", event, "Session:", !!newSession);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
          const profileData = await fetchProfile(newSession.user.id);
          setProfile(profileData);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setProfile(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
          // Não precisamos recarregar o perfil no refresh do token
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isTrialing = profile?.trial_ends_at 
    ? new Date(profile.trial_ends_at) > new Date() 
    : false;

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isTrialing }}>
      {children}
    </AuthContext.Provider>
  );
};
