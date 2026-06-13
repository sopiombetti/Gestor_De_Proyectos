interface SelectProps {
  title: string;
  options: {
    value: number | string;
    label: string;
  }[];
  value: number | string;
  onChange: (value: string) => void;
}

export default function Select({
  title,
  options,
  value,
  onChange,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        {title}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 pb-2"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}