interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  size: "sm" | "md" | "lg";
}
const variantClasses = {
  primary: "bg-[#0166ff] text-white",
  secondary:
    "bg-gradient-to-r from-[#c7f384] to-[#c7f384] text-black", 
};

const sizeClasses = {
  sm: "text-sm px-2 py-1",
  md: "text-md px-4 py-2",
  lg: "text-lg px-6 py-3",
};
const defaultStyles="px-4 py-2 rounded-md cursor-pointer";

export default function Button({variant,text,size}:ButtonProps) {
  return <button className={`${defaultStyles} ${variantClasses[variant]} ${sizeClasses[size]}`} >{text}</button>;
}
