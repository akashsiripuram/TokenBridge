import Select from "./Select";
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
}: SwapFieldProps) {

  return (
    <div
      className={`flex flex-col border gap-2 p-4 rounded-2xl border-gray-600 ${variantStyles[variant]}`}
    >
      <div className="text-sm">{label}</div>
      <div className="flex flex-row items-center gap-2">
        <Select tokens={tokens} />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border px-3 py-1 rounded-md outline-none border-none text-end font-bold text-xl h-16"
        />
      </div>
    </div>
  );
}
