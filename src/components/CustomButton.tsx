import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";

export type TCustomButton = {
  type: "submit" | "reset" | "button";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

const CustomButton = (props: TCustomButton) => {
  return (
    <Button
      type={props.type}
      disabled={props.disabled}
      className={props.className}
      style={props.style}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
