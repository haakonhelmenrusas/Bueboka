import firebaseApp from "./";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export const googleLogin = () => {
	const auth = getAuth(firebaseApp);
	const googleAuthProvider = new GoogleAuthProvider();
	return () => {
		return signInWithRedirect(auth, googleAuthProvider);
	}
}
