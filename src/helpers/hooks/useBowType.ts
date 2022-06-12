import { useState } from "react";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth } from "firebase/auth";

import firebaseApp from "../../auth/";


const useBowType = () => {
	const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
	const [error, setError] = useState<any | null>(null);

	/**
	 * Store bow type in users profile in database.
	 *
	 * @param bowType
	 */
	const writeBowType = async (bowType: string): Promise<void> => {
		const auth = getAuth(firebaseApp);
		const database = getDatabase(firebaseApp)
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		setStatus("pending");
		update(ref(database, "users/" + userId + "/profile"),
			{
				bowType: bowType,
			},
		)
			.then(() => {
				setStatus("success");
			})
			.catch((error) => {
				setError(error);
				setStatus("error");
			});
	};

	return {
		status,
		error,
		writeBowType,
	};
};

export default useBowType;
