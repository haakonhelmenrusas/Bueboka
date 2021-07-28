import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import firebase from 'firebase';

import { UserContext } from '../helpers/StateProvider'
import Button from '../components/button/Button';
import { User } from '../types/User';

const provider = new firebase.auth.FacebookAuthProvider();

const FacebookLogin = () => {

  const history = useHistory();
  const { updateUser } = useContext(UserContext);

  function saveUserToContext(user: firebase.User) {
    const userProfile: User = {
      displayName: user.displayName!,
      email: user.email!,
      photoURL: user.photoURL!
    }
    updateUser(userProfile);
    history.push('/user')
  }

  const loginWithFacebook = async () => {
    await firebase.auth().setPersistence('local');

    return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      if (user) {
        saveUserToContext(user);
      }
    })
    .catch((error) => {
    })
  }

  return (
    <>
      <Button style={{ width: 200}} buttonStyle="primary" onClick={loginWithFacebook} label="Logg inn med Facebook"></Button>
    </>
  )

};

export default FacebookLogin;