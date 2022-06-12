import {useState} from "react";
import {getDatabase, ref, set} from "firebase/database";
import {getAuth} from "firebase/auth";

import firebaseApp from "../../auth/";
import {Status} from "../../models";


const useArcherNumber = () => {
	const [status, setStatus] = useState<Status>(Status.Idle);
	const [error, setError] = useState<any | null>(null);

	/**
	 * Store archer number in users profile in database.
	 *
	 * @param archerNumber
	 */
	const writeArcherNumber = async (archerNumber: number): Promise<void> => {
		const auth = getAuth(firebaseApp);
		const database = getDatabase(firebaseApp)
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		setStatus(Status.Pending);
		set(ref(database, "users/" + userId + "/profile"),
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
	};

	return {
		status,
		error,
		writeArcherNumber,
	};
};

export default useArcherNumber;
