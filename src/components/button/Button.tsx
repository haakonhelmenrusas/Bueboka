import React from "react";

import styles from "./Button.module.css";

type ButtonType = "button" | "submit" | "reset";
type ButtonStyle = "primary" | "danger";

interface ButtonProps {
  type?: ButtonType;
  label: string;
  buttonStyle: ButtonStyle;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
}

const Button: React.FC<ButtonProps> = (props): JSX.Element => {
  const { label, onClick, buttonStyle, type } = props;
    return (
      <button type={type} onClick={onClick} className={[styles.button, styles[buttonStyle]].join(' ')}>
        {label}
      </button>
    );
};

export default Button;