import FacebookLogin from '../../auth/FacebookLogin';
import Layout from '../../components/layout/Layout';
import styles from './Login.module.css';

const Login = () => {
  return (
    <Layout>
      <div className={styles.welcomeContainer}>
        <h2>Velkommen!</h2>
        <p>Med denne tjenesten kan du enkelt:</p>
        <ul className={styles.list}>
          <li>logge inn med Facebook</li>
          <li>oppdatere din profil med skytternr. og data om ditt utstyr</li>
          <li>legge inn mål fra skytting og få beregnet siktemål</li>
        </ul>
        <FacebookLogin />
      </div>
    </Layout>
  )
}

export default Login;
