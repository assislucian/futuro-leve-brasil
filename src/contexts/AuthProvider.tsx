
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  trial_ends_at: string | null;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isTrialing: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("AuthProvider: Buscando perfil para usuário:", userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("AuthProvider: Erro ao buscar perfil:", error);
        if (error.code === 'PGRST116') {
          console.log("AuthProvider: Perfil não encontrado, será criado automaticamente no próximo login");
        }
        return null;
      }
      
      console.log("AuthProvider: Perfil encontrado:", profileData);
      return profileData as Profile;
    } catch (error) {
      console.error("AuthProvider: Exceção ao buscar perfil:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Configurando listener de autenticação");
    
    // Função para lidar com mudanças de auth
    const handleAuthChange = async (event: string, session: Session | null) => {
      console.log("AuthProvider: Mudança de auth:", event, "Sessão:", !!session);
      
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };

    // Configurar listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        console.log("AuthProvider: Verificando sessão inicial");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider: Erro ao obter sessão:", error);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log("AuthProvider: Sessão inicial encontrada");
          setSession(session);
          setUser(session.user);
          
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          console.log("AuthProvider: Nenhuma sessão inicial encontrada");
        }
      } catch (error) {
        console.error("AuthProvider: Erro na inicialização:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("AuthProvider: Limpando listener de auth");
      subscription?.unsubscribe();
    };
  }, []);

  const isTrialing = profile?.trial_ends_at ? new Date(profile.trial_ends_at) > new Date() : false;

  const value = {
    user,
    session,
    profile,
    loading,
    isTrialing,
  };

  console.log("AuthProvider: Estado atual - usuário:", !!user, "carregando:", loading, "perfil:", !!profile);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
