import { LucideIcon } from "lucide-react";

type InputProps = {
  icon: LucideIcon;
};

const Input = ({ icon: Icon, ...props }: InputProps) => {
  return (
    <div>
      <Icon className="size-5" />
    </div>
  );
};

export default Input;
