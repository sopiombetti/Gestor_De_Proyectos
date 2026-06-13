type InputProps = {
  title: string;
  type: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  title,
  type,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label>{title}</label>

          <input
        type={type}
        value={value}
        onChange={onChange}

        className="
        mb-4
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-3
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
        "
      />
    </div>
  )
}