import {useCallback, useState} from "react";
import { ref, getDatabase, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

import firebaseApp from "../../auth/";

const useFetchBow = () => {
	const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
	const [bowType, setValue] = useState<string | null>(null);
	const [error, setError] = useState<any | null>(null);

	const getBow = useCallback(() => {
		const auth = getAuth(firebaseApp);
		const db = getDatabase(firebaseApp);
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		setStatus("pending");
		try {
			const dbRef = ref(db, "users/" + userId + "/profile");
			onValue(dbRef, (snapshot) => {
				const { bowType } = snapshot.val();
				setValue(bowType);
			})
		} catch (e) {
			setError(e);
		}
	}, []);

	return {
		status,
		bowType,
		error,
		getBow,
	};
};

export default useFetchBow;
