type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
};

function Button(props: Props) {
  const { children, onClick, disabled, className, type = "button" } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 h-10 rounded-lg text-sm font-semibold cursor-pointer grid place-items-center ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
