import type { FormEvent } from "react";
import Button from "../Button";

type Props = {
  credentials: {
    email: string;
    password: string;
  };
  updateCredentials(key: "email" | "password", val: string): void;
  submitForm: (type: "login") => void;
};

function Login(props: Props) {
  const { credentials, updateCredentials, submitForm } = props;

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    submitForm("login");
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmitForm}>
      <header>
        <h1 className="text-xl text-sky-300 font-medium">Log In</h1>
        <p className="text-sm text-zinc-500">Log in and report incidents.</p>
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

        <Button type="submit" className="bg-sky-300 text-white">
          Sign In
        </Button>
      </div>
    </form>
  );
}

export default Login;
