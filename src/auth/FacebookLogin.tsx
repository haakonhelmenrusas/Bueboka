import { useContext } from 'react';
import firebase from 'firebase';

import { UserContext } from '../helpers/StateProvider'
import Button from '../components/button/Button';
import { User } from '../types/User';

const provider = new firebase.auth.FacebookAuthProvider();

const FacebookLogin = () => {

  const { user, updateUser } = useContext(UserContext);

  function loginWithFacebook() {
    firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      if (user) {
        const userProfile: User = {
          displayName: user.displayName!,
          email: user.email!,
          photoURL: user.photoURL!
        }
        updateUser(userProfile);
      }
      console.log('FACEBOOK USER: ', result);

    })
    .catch((error) => {
      // Handle Errors here.
      //const errorCode = error.code;
      //const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //const credential = error.credential;
      
    })
  }

  return (
    <>
      <Button buttonStyle="primary" onClick={loginWithFacebook} label="Logg inn med Facebook"></Button>
    </>
  )

};

export default FacebookLogin;