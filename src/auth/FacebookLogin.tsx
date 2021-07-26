import React from 'react';
import firebase from 'firebase';
import Button from '../components/button/Button';

const provider = new firebase.auth.FacebookAuthProvider();

const FacebookLogin = () => {

  function loginWithFacebook() {
    firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      console.log('FACEBOOK USER: ', result);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
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