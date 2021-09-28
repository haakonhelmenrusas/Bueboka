import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { getAuth, signInWithRedirect , FacebookAuthProvider } from "firebase/auth";

import { UserContext } from "../helpers/StateProvider";
import Button from "../components/button/Button";
import { User } from "../types/User";

const auth = getAuth();

const FacebookLogin = () => {
  const history = useHistory();
  const { updateUser } = useContext(UserContext);

  function saveUserToContext(user) {
    const userProfile: User = {
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
      const result_1 = await signInWithRedirect(auth);
      // The signed-in user info.
      const user = result_1.user;
      if (user) {
        saveUserToContext(user);
      }
    } catch (error) {}
  };

  const loginWithFacebook = async () => {
    await firebase.auth().setPersistence("local");

    await firebase.auth().signInWithRedirect(provider);
    facebookSignInRedirectResult();
  };

  return (
    <>
      <Button
    style={{width: 200}}
    buttonStyle="primary"
    onClick={loginWithFacebook}
    label="Logg inn med Facebook"
    />
    </>
  );
};

export default FacebookLogin;
