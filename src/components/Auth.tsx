import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { LoadingIcon } from "../icons";

import { auth } from "../services/auth";
import { authSchema, type Credentials } from "../utils/validation/auth";
import Button from "./Button";

const tabs = ["Sign Up", "Log In", "Anonymous"] as const;
type Tab = (typeof tabs)[number];

type Content = Record<
  Tab,
  {
    title: string;
    content: string;
    button: string;
    "text-color": string;
    "background-color": string;
  }
>;

// const content: Content = {
//   "Sign Up": {
//     title: "Create Account",
//     content: "Create an account to get started.",
//     button: "Sign In",
//     "text-color": "text-indigo-300",
//     "background-color": "bg-indigo-300",
//   },
//   "Log In": {
//     title: "Log In",
//     content: "Log in and report incidents.",
//     button: "Log In",
//     "text-color": "text-sky-300",
//     "background-color": "bg-sky-300",
//   },
//   Anonymous: {
//     title: " Sign In Anonymously.",
//     content: " Get started. No email/password necessary.",
//     button: " Sign In As Guest",
//     "text-color": "text-orange-300",
//     "background-color": "bg-orange-300",
//   },
// };

const content: Content = {
  "Sign Up": {
    title: "Join Us Today",
    content:
      "Create your account and start making a difference in your community.",
    button: "Create Account",
    "text-color": "text-indigo-300",
    "background-color": "bg-indigo-300",
  },
  "Log In": {
    title: "Welcome Back",
    content: "Sign in to report incidents and track your submissions.",
    button: "Log In",
    "text-color": "text-sky-300",
    "background-color": "bg-sky-300",
  },
  Anonymous: {
    title: "Quick Access",
    content: "Report incidents instantly without creating an account.",
    button: "Continue as Guest",
    "text-color": "text-orange-300",
    "background-color": "bg-orange-300",
  },
};

function Auth() {
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({
    resolver: zodResolver(authSchema),
  });

  const navigate = useNavigate();

  // Tabs
  const rendered_tabs = tabs.map((t) => {
    return (
      <li
        key={t}
        onClick={() => setActiveTab(t)}
        className={`font-medium text-sm cursor-pointer grid place-items-center rounded-md 
          ${activeTab !== t ? "opacity-40" : ""} 
          ${
            activeTab == t ? `${content[t]["background-color"]} text-white` : ""
          } 
          `}
      >
        {t}
      </li>
    );
  });

  async function submitForm(credentials: Credentials) {
    setError("root", { message: "" });
    setIsLoading(true);

    try {
      let result;

      switch (activeTab) {
        case "Sign Up":
          result = await auth({
            mode: "signup",
            email: credentials.email,
            password: credentials.password,
          });
          break;

        case "Log In":
          result = await auth({
            mode: "login",
            email: credentials.email,
            password: credentials.password,
          });
          break;

        case "Anonymous":
          result = await auth({ mode: "anonymous" });
          break;

        default:
          throw new Error("Invalid auth action.");
      }

      if (result?.error) {
        throw new Error(result.error);
      }

      navigate("/");
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full background relative grid place-items-center overflow-auto py-8">
      {isLoading && <LoadingIcon className="animate-spin size-4" />}

      {!isLoading && (
        <div className="wrapper flex flex-col gap-10 max-w-sm min-h-100">
          <ul className="list-none bg-white border border-gray-100 h-10 grid grid-cols-3 p-2 rounded-xl">
            {rendered_tabs}
          </ul>

          {errors.root && (
            <p className="input-error">
              {activeTab !== "Log In"
                ? "Could not Sign Up."
                : "Could not Log In"}
              &nbsp;
              {errors.root.message}
            </p>
          )}

          <div className="max-w-xs">
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(submitForm)}
            >
              <header>
                <h1
                  className={`text-xl font-medium ${content[activeTab]["text-color"]}`}
                >
                  {content[activeTab].title}
                </h1>
                <p className="text-sm text-zinc-500">
                  {content[activeTab].content}
                </p>
              </header>

              {activeTab !== "Anonymous" && (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm">
                      Email
                    </label>

                    <input
                      type="email"
                      {...register("email")}
                      placeholder="lanakane@isis.com"
                      className="input"
                    />
                    {errors.email && (
                      <p className="input-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm ">
                      Password
                    </label>

                    <input
                      {...register("password")}
                      placeholder="lanakane"
                      className="input"
                    />
                    {errors.password && (
                      <p className="input-error">{errors.password.message}</p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`text-white ${content[activeTab]["background-color"]}`}
              >
                {content[activeTab].button}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;
