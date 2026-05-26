type SelectProps = {
  title: string;
  options: string[];
};

export default function Select({
  title,
  options,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        {title}
      </label>

      <select
        className="
        mb-4
          w-full
          border
          border-gray-300
          rounded-xl
          px-4
          py-3
          outline-none
          focus:border-blue-500
       
        "
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}