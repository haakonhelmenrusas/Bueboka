import Logo from "../../assets/images/logo512.png";
import Navbar from "../navbar/Navbar";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.logo} src={Logo} alt="Logo" />
        <h1>Bueskytterens assistent</h1>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
