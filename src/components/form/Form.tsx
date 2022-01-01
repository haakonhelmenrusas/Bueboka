import React from "react";
import { Button, Form } from 'react-bootstrap';

import MålA from "../../assets/images/Mål_A.jpg";
import styles from "./Form.module.css";

const CalculateForm = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("DATA SENT");
  };

  return (
      <div>
        <h3>Dine mål</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicMalA">
            <Form.Label>Mål A</Form.Label>
            <Form.Control type="text"/>
            <Form.Text className="text-muted">
              Hva er mål A?
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMalB">
            <Form.Label>Mål B</Form.Label>
            <Form.Control type="text"/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <div className={styles.measureAImageContainer}>
          <img className={styles.measureAImage} src={MålA} alt="Mål a"/>
        </div>
      </div>
  );
};

export default CalculateForm;
