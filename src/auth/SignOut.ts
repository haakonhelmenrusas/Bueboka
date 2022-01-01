import {getAuth} from "firebase/auth";
import firebaseApp from "./";

export const logOut = () => {
	const auth = getAuth(firebaseApp);
	return auth.signOut();
}
