import { Input } from "./ui/input";

export type TCustomInput = {
  value: string | number;
  onChange: (event: any) => void;
  type: React.HTMLInputTypeAttribute;
  id?: string;
  disabled: boolean;
  placeHolder?: string;
  className?: string;
  required?: boolean;
};

const CustomInput = (props: TCustomInput) => {
  return (
    <Input
      id={props.id}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeHolder}
      disabled={props.disabled}
      className={props.className}
      required={props.required}
    />
  );
};

export default CustomInput;
