import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebaseApp from "../../auth/FirebaseConfig";


const useArcherNumber = () => {
	const [status, setStatus] = useState<
			"idle" | "pending" | "success" | "error"
			>("idle");
	const [error, setError] = useState<any | null>(null);

	/**
	 * Store archer number in users profile in database.
	 *
	 * @param archerNumber
	 */
	const writeArcherNumber = async (archerNumber: number): Promise<void> => {
		const auth = getAuth(firebaseApp);
		const database = getDatabase(firebaseApp)
		const userId = auth.currentUser!.uid;

		setStatus("pending");
		set(ref(database, "users/" + userId),
						{
							profile: {
								archerNumber: archerNumber,
							},
						},
				)
				.then(() => {
					setStatus("success");
				})
				.catch(() => {
					setError(error);
					setStatus("error");
				});
	};

	return {
		status,
		error,
		writeArcherNumber,
	};
};

export default useArcherNumber;
