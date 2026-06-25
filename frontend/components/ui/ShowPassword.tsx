import { useState } from "react";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder
}: PasswordInputProps) {

  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (

    <div className="relative w-full">

      <input
        type={mostrarPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          border
          border-gray-500
          rounded-md
          px-3
          py-2
          pr-10
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      <button
        type="button"
        onClick={() => setMostrarPassword(!mostrarPassword)}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          cursor-pointer
        "
      >
        👁
      </button>

    </div>
  );
}