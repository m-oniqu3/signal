import { useState } from "react";
import Anon from "./Anon";
import Login from "./Login";
import Signin from "./Signin";

function Auth() {
  const tabs = ["Signin", "Login", "Anonymous"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const colourMap = {
    [tabs[0]]: "text-blue-300",
    [tabs[1]]: "text-indigo-300",
    [tabs[2]]: "text-gray-300",
  };

  const rendered_tabs = tabs.map((t) => {
    // })();

    return (
      <li
        key={t}
        onClick={() => setActiveTab(t)}
        className={`font-medium cursor-pointer pb-4 border-b-4 w-full ${
          colourMap[t]
        } ${activeTab !== t ? "opacity-40" : " "} `}
      >
        {t}
      </li>
    );
  });

  const renderedComponent = (() => {
    if (!activeTab) return;

    switch (activeTab) {
      case tabs[0]:
        return <Signin />;

      case tabs[1]:
        return <Login />;

      case tabs[2]:
        return <Anon />;

      default:
        throw new Error("Active tab is not valid.");
    }
  })();

  if (!renderedComponent) return null;

  return (
    <div className="h-full bg-slate-50 grid place-items-center">
      <div className="w-full mx-auto max-w-sm flex flex-col gap-10">
        <ul className="list-none flex justify-between">{rendered_tabs}</ul>
        <div className="">{renderedComponent}</div>
      </div>
    </div>
  );
}

export default Auth;
