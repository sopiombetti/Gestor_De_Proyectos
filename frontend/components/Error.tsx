import { useState } from "react";

export default function Error({text}) {

      const [visible, setVisible] = useState(true);

        if (!visible) return null;

  return (
    <div className="flex items-center justify-between bg-red-100 border border-red-500 text-red-800 px-4 py-3 rounded-md w-full">

      <div className="flex items-center gap-3">
        
        <span className="text-red-800 text-2xl font-bold leading-none">
  ⓘ
</span>

        <p className="text-sm font-medium">
          {text}
        </p>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="cursor-pointer text-lg font-bold"
      >
        ✕
      </button>
    
    </div>
  );
}