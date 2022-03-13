import {FacebookAuthProvider, getAuth, signInWithPopup} from "firebase/auth";

import firebaseApp from "./";

export const facebookLogin = async () => {
	const auth = getAuth(firebaseApp);
	const provider = new FacebookAuthProvider();
	await signInWithPopup(auth, provider);
};
