import React, { useEffect } from 'react';
import firebase from 'firebase';

const provider = new firebase.auth.FacebookAuthProvider();

interface IFacebookLogin  { 
  children: React.ReactNode
}

const FacebookLogin = ( {children} : IFacebookLogin) => {

  useEffect(() => {
    firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
  
      // The signed-in user info.
      const user = result.user;
      console.log('FACEBOOK USER: ', user);
      
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
  }, [])

  return (
    <>
    {children}
    </>
  )

};

export default FacebookLogin;