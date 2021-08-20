import React from "react";

import MålA from "../../assets/images/Mål_A.jpg";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./Form.module.css";

const Form: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("DATA SENT");
  };

  return (
    <form
      onSubmit={handleSubmit}
      name="Bueskytterens assistent"
      className={styles.component}
    >
      <h3>Dine mål</h3>
      <section className={styles.mesureSection}>
        <div className={styles.mesureInputs}>
          <input
            type="hidden"
            name="form-name"
            value="Bueskytterens assistent"
          />
          <Input
            style={{ width: 80, marginRight: 16 }}
            type="text"
            id="mesureA"
            name="mesureA"
            labelName="Mål A"
          />
          <Input
            style={{ width: 80 }}
            type="text"
            id="mesureB"
            name="mesureB"
            labelName="Mål B"
          />
        </div>
        <div className={styles.measureAImageContainer}>
          <img className={styles.measureAImage} src={MålA} alt="Mål a" />
        </div>
      </section>
      <Button type="submit" buttonStyle="primary" label="Send inn" />
    </form>
  );
};

export default Form;
