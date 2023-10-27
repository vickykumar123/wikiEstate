import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function PasswordToggle({
  placeholder,
  name,
  onChange,
  required = true,
  disabled = false,
}) {
  const [isTypePassword, setIsTypePassword] = useState("password");

  function handlePasswordToggle() {
    if (isTypePassword === "password") {
      setIsTypePassword("text");
    } else {
      setIsTypePassword("password");
    }
  }
  return (
    <div className="relative flex">
      <input
        type={isTypePassword}
        placeholder={placeholder}
        className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1 input w-full "
        name={name}
        id={name}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      <span
        className="absolute right-1 bottom-[10px]"
        onClick={handlePasswordToggle}
      >
        {isTypePassword !== "password" ? (
          <EyeIcon className="h-7 text-violet-500 opacity-70" />
        ) : (
          <EyeSlashIcon className="h-7 text-violet-500 opacity-70" />
        )}
      </span>
    </div>
  );
}
