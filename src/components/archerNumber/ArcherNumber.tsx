import styles from './ArcherNumber.module.css';

interface IArcherNumber {
  archerNumber: number;
}

const ArcherNumber = ({ archerNumber }: IArcherNumber) => {
  return (
    <div className={styles.archerNumberContainer}>
        <p className={styles.title}>Skytternr</p>
        <div className={styles.numberContainer}>
          <span className={styles.number}>{archerNumber}</span>
        </div>
    </div>
  );
};

export default ArcherNumber;
