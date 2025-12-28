import type { FormEvent } from "react";
import Button from "../Button";

type Props = {
  credentials: {
    email: string;
    password: string;
  };
  updateCredentials(key: "email" | "password", val: string): void;
  submitForm: (type: "signin") => void;
};

function Signin(props: Props) {
  const { credentials, updateCredentials, submitForm } = props;

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    submitForm("signin");
  }
  return (
    <div className="">
      <form className="flex flex-col gap-6" onSubmit={handleSubmitForm}>
        <header>
          <h1 className="text-xl text-indigo-300 font-medium">
            Create Account
          </h1>
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
              onChange={(e) => updateCredentials("email", e.target.value)}
              className="input"
              name="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              onChange={(e) => updateCredentials("password", e.target.value)}
              className="input"
              placeholder="lanakane"
              name="password"
            />
          </div>

          <Button type="submit" className="bg-indigo-300 text-white">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Signin;
