import React from "react";
import { Bow } from "tabler-icons-react";

import styles from "./BowType.module.css";

interface BowTypeProps {
  bowType: string | null;
}

const BowType: React.FC<BowTypeProps> = ({ bowType }) => {
  if (bowType) {
    return (
      <div className={styles.container}>
        <Bow />
        <p className={styles.bowType}>{bowType}</p>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <p>Ingen bue lagret</p>
      </div>
    );
  }
};
export default BowType;
