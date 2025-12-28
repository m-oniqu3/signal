import { useState } from "react";
import Anon from "./Anon";
import Login from "./Login";
import Signin from "./Signin";

function Auth() {
  const tabs = ["Signin", "Login", "Anonymous"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const colourMap = {
    [tabs[0]]: "bg-indigo-300",
    [tabs[1]]: "bg-sky-300",
    [tabs[2]]: "bg-orange-300",
  };

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

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

  function signIn() {
    console.log("signing in");
  }

  function logIn() {
    console.log("logging in");
  }

  function anonSignIn() {
    console.log("anonymous signin");
  }

  function authenticate(type: "signin" | "login" | "anon") {
    if (!type) return;
    switch (type) {
      case "signin":
        return signIn();

      case "login":
        return logIn();

      case "anon":
        return anonSignIn();

      default:
        throw new Error("Authentication type not valid.");
    }
  }

  const rendered_tabs = tabs.map((t) => {
    return (
      <li
        key={t}
        onClick={() => setActiveTab(t)}
        className={`font-medium text-sm cursor-pointer grid place-items-center rounded-md 
          ${activeTab !== t ? "opacity-40" : ""} 
          ${activeTab == t ? `${colourMap[t]} text-white` : ""} 
          `}
      >
        {t}
      </li>
    );
  });

  const renderedComponent = (() => {
    if (!activeTab) return;

    switch (activeTab) {
      case tabs[0]:
        return (
          <Signin
            credentials={credentials}
            updateCredentials={handleCredentials}
            submitForm={authenticate}
          />
        );

      case tabs[1]:
        return (
          <Login
            credentials={credentials}
            updateCredentials={handleCredentials}
            submitForm={authenticate}
          />
        );

      case tabs[2]:
        return <Anon submitForm={authenticate} />;

      default:
        throw new Error("Active tab is not valid.");
    }
  })();

  if (!renderedComponent) return null;

  return (
    <div className="h-full background relative">
      <div className="wrapper h-full flex flex-col gap-10 max-w-sm justify-center ">
        <ul className="list-none bg-white border border-gray-100 h-10 grid grid-cols-3 p-2 rounded-xl">
          {rendered_tabs}
        </ul>
        <div className="max-w-xs h-60">{renderedComponent}</div>
      </div>
    </div>
  );
}

export default Auth;
