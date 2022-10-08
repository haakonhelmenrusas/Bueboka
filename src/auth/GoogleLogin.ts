import firebaseApp from "./";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const googleLogin = async () => {
  const auth = getAuth(firebaseApp);
  const googleAuthProvider = new GoogleAuthProvider();
  await signInWithPopup(auth, googleAuthProvider);
};
