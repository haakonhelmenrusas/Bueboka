import {useState} from "react";
import { getFirestore, doc, setDoc  } from 'firebase/firestore/lite';
import {getAuth} from "firebase/auth";

import firebaseApp from "../../auth/";
import {Status} from "../../models";


const useArcherNumber = () => {
	const [status, setStatus] = useState<Status>(Status.Idle);
	const [error, setError] = useState<any | null>(null);

	const writeArcherNumber = async (archerNumber: number): Promise<void> => {
		const auth = getAuth(firebaseApp);
		const database = getFirestore(firebaseApp)
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		if (userId) {
			setStatus(Status.Pending);
			setDoc(doc(database, 'users', userId),
					{
						archerNumber: archerNumber,
					},
				)
				.then(() => {
					setStatus(Status.Success);
				})
				.catch((error) => {
					setError(error);
					setStatus(Status.Idle);
				});
		}
	};

	return {
		status,
		error,
		writeArcherNumber,
	};
};

export default useArcherNumber;
