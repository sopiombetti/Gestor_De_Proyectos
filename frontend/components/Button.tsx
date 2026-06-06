type ButtonTypes = {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({onClick, title, type = "button"}: ButtonTypes) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        bg-blue-500
        text-white
        px-4
        py-2
        cursor-pointer
        hover:bg-blue-600
        rounded-xl
        transition-all
      "
    >
      {title}
    </button>
  );
}