import { supabase } from "../lib/supabase";

type AuthMode = "signup" | "login" | "anonymous";

type Props = {
  mode: AuthMode;
  email?: string;
  password?: string;
};

export async function auth({ mode, email, password }: Props) {
  try {
    switch (mode) {
      case "signup": {
        if (!email || !password) {
          throw new Error("Email and password are required to sign up.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        return { data, error: null };
      }

      case "login": {
        if (!email || !password) {
          throw new Error("Email and password are required to log in.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        return { data, error: null };
      }

      case "anonymous": {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        return { data, error: null };
      }

      default:
        throw new Error("Unsupported auth mode");
    }
  } catch (err) {
    console.log(err);

    return {
      data: null,
      error: err instanceof Error ? err.message : "Authentication failed.",
    };
  }
}
