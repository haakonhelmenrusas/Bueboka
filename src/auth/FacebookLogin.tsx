import {useHistory} from "react-router-dom";
import {useContext} from "react";
import {Button} from 'react-bootstrap';
import {
  browserSessionPersistence,
  FacebookAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithRedirect,
  User
} from "firebase/auth";

import {UserContext} from "../helpers/StateProvider";
import {IUser} from "../types/User";
import firebaseApp from "./FirebaseConfig";

const auth = getAuth(firebaseApp);
const provider = new FacebookAuthProvider();

const FacebookLogin = () => {
  const history = useHistory();
  const {updateUser} = useContext(UserContext);

  auth.setPersistence(browserSessionPersistence);

  function saveUserToContext(user: User) {
    const userProfile: IUser = {
      displayName: user.displayName!,
      email: user.email!,
      photoURL: user.photoURL!,
      id: user.uid,
    };
    updateUser(userProfile);
    history.push("/user");
  }

  const facebookSignInRedirectResult = async () => {
    try {
      const result_1 = await getRedirectResult(auth, provider);

      if (result_1) {
        const user = result_1.user;
        if (user) {
          saveUserToContext(user);
        }
      }
    } catch (error) {
      console.log("ERROR", error)
    }
  };

  const loginWithFacebook = async () => {
    await signInWithRedirect(auth, provider);
    await facebookSignInRedirectResult();
  };

  return (
      <>
        <Button
            style={{width: 200}}
            variant="primary"
            onClick={loginWithFacebook}>Logg inn med Facebook</Button>

      </>
  );
};

export default FacebookLogin;
