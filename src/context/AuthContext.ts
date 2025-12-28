import type { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
