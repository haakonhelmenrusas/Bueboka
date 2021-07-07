import React, { useState } from "react";

import MålA from '../../assets/images/Mål_A.jpg';
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./Form.module.css";

const Form: React.FC = (): JSX.Element => {

  const [mesureA, setMesureA] = useState('');
  const [mesureB, setMesureB] = useState('');

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setMesureA('');
    setMesureB('');
    console.log(mesureA, mesureB)
  };

  return (
    <form name="Bueskytterens assistent" data-netlify="true" onSubmit={submitForm} className={styles.component}>
      <h3>Dine mål</h3>
      <section className={styles.mesureSection}>
        <div className={styles.mesureInputs}>
        <input type="hidden" name="form-name" value="Bueskytterens assistent" />
          <Input
            style={{ width: 80, marginRight: 16}}
            type="number"
            id="mesureA"
            labelName="Mål A"
            onChange={mesureA => setMesureA(mesureA.currentTarget.value)}
            value={mesureA}
          />
          <Input
            style={{ width: 80}}
            type="number"
            id="mesureB"
            labelName="Mål B"
            onChange={mesureB => setMesureB(mesureB.currentTarget.value)}
            value={mesureB}
            minLength={8}
          />
        </div>
        <div className={styles.measureAImageContainer}>
          <img className={styles.measureAImage} src={MålA} alt="Mål a" />
        </div>
      </section>
      <Button
        type="submit"
        buttonStyle="primary"
        label="Send inn"
      />
    </form>
  );
};

export default Form;