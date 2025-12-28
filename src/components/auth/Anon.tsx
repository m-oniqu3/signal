import type { FormEvent } from "react";
import Button from "../Button";

type Props = {
  submitForm: (type: "anon") => void;
};

function Anon(props: Props) {
  const { submitForm } = props;
  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    submitForm("anon");
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmitForm}>
      <header>
        <h1 className="text-xl text-orange-300 font-medium">
          Sign In Anonymously.
        </h1>
        <p className="text-sm text-zinc-500">
          Get started. No email/password necessary.
        </p>
      </header>

      <Button type="submit" className="bg-orange-300 text-white">
        Sign In As Guest
      </Button>
    </form>
  );
}

export default Anon;
