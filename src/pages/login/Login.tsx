import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import FacebookLogin from '../../auth/FacebookLogin';
import Button from '../../components/button/Button';
import Layout from '../../components/layout/Layout';
import { UserContext } from '../../helpers/StateProvider';
import styles from './Login.module.css';

const Login = () => {

  const { user } = useContext(UserContext);
  const history = useHistory();

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
        {user.displayName ? (
          <Button style={{ width: 200}} buttonStyle="primary" onClick={() => history.push('/user')} label="Min profil"></Button>
        ) : (
          <>
            <FacebookLogin />
          </>
        )}
      </div>
    </Layout>
  )
}

export default Login;
