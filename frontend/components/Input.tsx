type InputProps = {
  title: string
  placeholder?: string
  type?: string
}

export default function Input({
  title,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        {title}
      </label>

      <input
        type={type}
        placeholder={placeholder}
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