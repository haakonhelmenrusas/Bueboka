import firebaseApp from "./";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export const googleLogin = async () => {
	const auth = getAuth(firebaseApp);
	const googleAuthProvider = new GoogleAuthProvider();
	await signInWithRedirect(auth, googleAuthProvider).then(() => {

	});

}
