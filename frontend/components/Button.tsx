type ButtonTypes = {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  title,
  type,
  onClick,
  disabled = false,
}: ButtonTypes) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-1 rounded-lg cursor-pointer
        ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }
      `}
    >
      {title}
    </button>
  );
}