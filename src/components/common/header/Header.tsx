import Logo from "../../../assets/images/logo512.png";
import Navbar from "../navbar/Navbar";
import styles from "./Header.module.css";
import {getAuth} from "firebase/auth";
import firebaseApp from "../../../auth/FirebaseConfig";

const Header = () => {
  const auth = getAuth(firebaseApp);
  const userId = auth.currentUser;
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.logo} src={Logo} alt="Logo" />
        <h1 className={styles.title}>Book of Arrows</h1>
      </div>
      {userId && (
        <Navbar />
      )}
    </header>
  );
};

export default Header;
