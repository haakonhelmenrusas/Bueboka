import React from "react";
import styles from "./Input.module.css";

type InputType = "text" | "number" | "password";

interface InputProps {
  id: string;
  name?: string;
  value?: string;
  type?: InputType;
  style?: React.CSSProperties;
  labelName: string;
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
}

/**
 * Input component. The labelName and id is required props.
 * @param props - Input attributes like type, id etc.
 */
const Input: React.FC<InputProps> = (props): JSX.Element => {
  const { isRequired, type, name, labelName, id, value, style, ...restProps } =
    props;
  return (
    <div style={style} className={styles.input}>
      <label className={styles.label} htmlFor={id}>
        {labelName}
      </label>
      <input
        className={styles.field}
        id={id}
        name={name}
        required={isRequired}
        type={type}
        value={value}
        {...restProps}
      />
    </div>
  );
};

export default Input;
