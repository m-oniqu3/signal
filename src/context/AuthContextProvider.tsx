// AuthProvider.tsx
import { useEffect, useState } from "react";

import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setisLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Get existing session on load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setisLoading(false);
    });

    // Listen for future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }

      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
