import { useState } from "react";
import TokenModal from "./TokenModal";

interface Token {
  symbol: string;
  logoURI: string;
  address: string;
}

interface SwapFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant: "primary" | "secondary";
  tokens: Token[];
  selected?: Token;
  setSelected: (token: Token) => void;
  disable: boolean;
}

const variantStyles = {
  primary: "bg-[#151d28] text-white",
  secondary: "bg-[#0b0e13] text-white",
};

export default function SwapField({
  label,
  value,
  onChange,
  placeholder,
  variant,
  tokens,
  selected,
  setSelected,
  disable,
}: SwapFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`flex flex-col border gap-2 p-4 rounded-2xl border-gray-600 ${variantStyles[variant]}`}
      >
        <div className="text-sm">{label}</div>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#1f2632] px-3 py-2 rounded-lg"
          >
            {selected ? (
              <>
                <img src={selected.logoURI} className="h-6 w-6 rounded-full" />
                <span className="text-white font-medium">
                  {selected.symbol}
                </span>
              </>
            ) : (
              <span className="text-white text-sm">Select Token</span>
            )}
          </button>
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 border px-3 py-1 rounded-md outline-none border-none text-end font-bold text-xl h-16 bg-transparent text-white `}
            disabled={disable}
          />
        </div>
      </div>

      {open && (
        <TokenModal
          tokens={tokens}
          onSelect={setSelected}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
