import { useState } from "react";
import Button from "../Button";

function Signin() {
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

  return (
    <div>
      <form className="flex flex-col gap-6">
        <header>
          <h1 className="text-xl text-blue-300 font-medium">Create Account</h1>
          <p className="text-sm text-zinc-500">
            Create an account to get started.
          </p>
        </header>

        <div className="flex flex-col gap-6">
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
              onChange={(e) => handleCredentials("password", e.target.value)}
              className="input"
              placeholder="lanakane"
              name="password"
            />
          </div>

          <Button type="submit" className=" bg-blue-300 text-white">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Signin;
