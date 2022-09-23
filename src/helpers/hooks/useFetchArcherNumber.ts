import {useCallback, useState} from "react";
import {getAuth} from "firebase/auth";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import firebaseApp from "../../auth/";
import {Status} from "../../models";

const useFetchArcher = () => {
	const [status, setStatus] = useState<Status>(Status.Idle);
	const [value, setValue] = useState<string | null>(null);
	const [error, setError] = useState<any | null>(null);

	const getArcherNumber = useCallback(async () => {
		const auth = getAuth(firebaseApp);
		const database = getFirestore(firebaseApp);
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		if (userId) {
			setStatus(Status.Pending);
			try {
				const dbRef = doc(database, "users/" + userId);
				onSnapshot(dbRef, (doc) => {
					if (doc.exists()) {
						const { archerNumber } = doc.data();
						setValue(archerNumber);
						setStatus(Status.Idle);
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
