import { useState, type FormEvent } from "react";
import Button from "./Button";

function Auth() {
  const tabs = ["Signin", "Login", "Anonymous"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Dynamic content for form
  const content = {
    [tabs[0]]: {
      title: "Create Account",
      content: "Create an account to get started.",
      button: "Sign In",
      "text-color": "text-indigo-300",
      "background-color": "bg-indigo-300",
    },
    [tabs[1]]: {
      title: "Log In",
      content: "Log in and report incidents.",
      button: "Log In",
      "text-color": "text-sky-300",
      "background-color": "bg-sky-300",
    },
    [tabs[2]]: {
      title: " Sign In Anonymously.",
      content: " Get started. No email/password necessary.",
      button: " Sign In As Guest",
      "text-color": "text-orange-300",
      "background-color": "bg-orange-300",
    },
  };

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  function handleCredentials(
    key: keyof typeof credentials,
    val: (typeof credentials)[keyof typeof credentials]
  ) {
    setCredentials((prevState) => {
      return {
        ...prevState,
        [key]: val,
      };
    });
  }

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

  function signIn() {
    console.log("signing in");
  }

  function logIn() {
    console.log("logging in");
  }

  function anonSignIn() {
    console.log("anonymous signin");
  }

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    switch (activeTab) {
      case tabs[0]:
        return signIn();

      case tabs[1]:
        return logIn();

      case tabs[2]:
        return anonSignIn();

      default:
        throw new Error("Active tab type is not valid.");
    }
  }

  return (
    <div className="h-full background relative">
      <div className="wrapper h-full flex flex-col gap-10 max-w-sm justify-center ">
        <ul className="list-none bg-white border border-gray-100 h-10 grid grid-cols-3 p-2 rounded-xl">
          {rendered_tabs}
        </ul>

        <div className="max-w-xs h-60">
          <form className="flex flex-col gap-6" onSubmit={handleSubmitForm}>
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

            {activeTab !== tabs[2] && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="lanakane@isis.com"
                    value={credentials.email}
                    onChange={(e) => handleCredentials("email", e.target.value)}
                    className="input"
                    name="email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>

                  <input
                    onChange={(e) =>
                      handleCredentials("password", e.target.value)
                    }
                    className="input"
                    placeholder="lanakane"
                    name="password"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className={`text-white ${content[activeTab]["background-color"]}`}
            >
              {content[activeTab].button}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
