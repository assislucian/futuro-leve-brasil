
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

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
    // onAuthStateChange fires an INITIAL_SESSION event on page load.
    // It also fires on SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, etc.
    // This is the single source of truth for the user's auth state.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // We still call getSession to cover edge cases where the listener might not fire
    // on initial load for a cached session. The listener will override this if it fires.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
         const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
      // Set loading to false only if the listener hasn't already done it.
      // This avoids a flicker on authenticated page loads.
      setLoading(l => (l ? false : l));
    });

    return () => {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
