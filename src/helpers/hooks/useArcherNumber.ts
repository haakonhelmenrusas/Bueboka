import { useState } from "react";
import firebase from "firebase";

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
		const userId = firebase.auth().currentUser!.uid;
		setStatus("pending");
		await firebase
				.database()
				.ref("users/" + userId)
				.set(
						{
							profile: {
								archerNumber: archerNumber,
							},
						},
						() => {}
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
