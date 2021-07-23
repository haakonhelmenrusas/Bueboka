import React, { useEffect } from 'react';
import firebase from 'firebase';
import Button from '../components/button/Button';

const provider = new firebase.auth.FacebookAuthProvider();

const FacebookLogin = () => {

  function loginWithFacebook() {
    firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
  
      // The signed-in user info.
      const user = result.user;
      console.log('FACEBOOK USER: ', result);
      
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      //const accessToken = credential.accessToken;
  
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
  
      
    })
  }

  useEffect(() => {
  }, [])

  return (
    <div>
      <Button buttonStyle="primary" onClick={loginWithFacebook} label="Logg inn med Facebook"></Button>
    </div>
  )

};

export default FacebookLogin;