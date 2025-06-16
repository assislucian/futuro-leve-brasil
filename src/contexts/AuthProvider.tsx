
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

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed:", event, "User ID:", session?.user?.id);
      
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        console.log("AuthProvider: Fetching profile for user:", currentUser.id);
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (error) {
            console.error("AuthProvider: Error fetching profile:", error);
          } else {
            console.log("AuthProvider: Profile fetched successfully");
            setProfile(profileData as Profile);
          }
        } catch (error) {
          console.error("AuthProvider: Exception fetching profile:", error);
        }
      } else {
        console.log("AuthProvider: No user, clearing profile");
        setProfile(null);
      }
      
      setLoading(false);
      console.log("AuthProvider: Auth state update complete");
    });

    // Verificar sessão inicial
    console.log("AuthProvider: Getting initial session");
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("AuthProvider: Error getting session:", error);
        setLoading(false);
        return;
      }
      
      if (session) {
        console.log("AuthProvider: Initial session found for user:", session.user.id);
        setSession(session);
        setUser(session.user);
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("AuthProvider: Error fetching initial profile:", profileError);
          } else {
            setProfile(profileData as Profile);
          }
        } catch (error) {
          console.error("AuthProvider: Exception fetching initial profile:", error);
        }
      } else {
        console.log("AuthProvider: No initial session found");
      }
      
      setLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth listener");
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

  console.log("AuthProvider: Current state - user:", !!user, "loading:", loading, "profile:", !!profile);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
