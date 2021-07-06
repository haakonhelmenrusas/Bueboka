import React, { useState } from "react";
import styles from "./Form.module.css";
import Button from "../button/Button";
import Input from "../input/Input";

const Form: React.FC = (): JSX.Element => {

  const [mesureA, setMesureA] = useState('');
  const [mesureB, setMesureB] = useState('');

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(mesureA, mesureB)
  };

  return (
    <form onSubmit={submitForm} className={styles.component}>
      <h3>Dine mål</h3>
      <section className={styles.mesureSection}>
        <Input
          style={{ width: 80}}
          type="number"
          id="mesureA"
          labelName="Mål A"
          onChange={mesureA => setMesureA(mesureA.currentTarget.value)}
          value={mesureA}
        />
        <Input
          style={{ width: 80}}
          type="number"
          id="password"
          labelName="Mål B"
          onChange={mesureB => setMesureB(mesureB.currentTarget.value)}
          value={mesureB}
          minLength={8}
        />
      </section>
      <Button
        type="submit"
        buttonStyle="primary"
        label="Beregn"
      />
    </form>
  );
};

export default Form;