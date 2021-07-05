import React from "react";
import styles from "./Input.module.css";

type InputType = "text" | "number" | "password";

interface InputProps {
  isRequired?: boolean;
  type?: InputType;
  placeholder?: string;
  name?: string;
  labelName: string;
  id: string;
  value?: string;
  minLength?: number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
}

/**
 * Input component. The labelName and id is required props.
 * @param props - Input attributes like type, id etc.
 */
const Input: React.FC<InputProps> = (props): JSX.Element => {
  const { isRequired, type, name, labelName, id, value, ...restProps } = props;
  return (
    <div className={styles.input}>
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