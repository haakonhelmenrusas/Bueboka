import {useCallback, useState} from "react";
import {getAuth} from "firebase/auth";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import firebaseApp from "../../auth/";

const useFetchArcher = () => {
	const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
	const [value, setValue] = useState<string | null>(null);
	const [error, setError] = useState<any | null>(null);

	const getArcherNumber = useCallback(async () => {
		const auth = getAuth(firebaseApp);
		const database = getFirestore(firebaseApp);
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		if (userId) {
			setStatus("pending");
			try {
				const dbRef = doc(database, "users/" + userId);
				const docSnap = onSnapshot(dbRef, (doc) => {
					if (doc.exists()) {
						const { archerNumber } = doc.data();
						setValue(archerNumber);
					}
				});
			} catch (e) {
				setError(e);
			}
		}
	}, []);

	return {
		status,
		value,
		error,
		getArcherNumber,
	};
};

export default useFetchArcher;
