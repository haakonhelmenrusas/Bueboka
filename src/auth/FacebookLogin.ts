import { FacebookAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";

import firebaseApp from "./";

export const facebookLogin = async () => {
  const auth = getAuth(firebaseApp);
  const provider = new FacebookAuthProvider();
  await signInWithRedirect(auth, provider);
};
