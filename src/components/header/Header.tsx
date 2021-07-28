import styles from './Header.module.css';
import Logo from '../../assets/images/logo512.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={Logo} alt="Logo" />
      <h1>Bueskytterens assistent</h1>
    </header>
  )
}

export default Header
