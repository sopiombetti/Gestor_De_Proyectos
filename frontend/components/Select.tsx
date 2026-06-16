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
      <div className="flex items-center space-x-2">
        <img className="w-5" src="/check.svg" alt="check"/>
        <label className="text-md font-medium text-gray-800">
          {title}:
        </label>
      </div>
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