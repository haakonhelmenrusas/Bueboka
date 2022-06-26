import {useCallback, useState} from "react";
import { ref, getDatabase, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

import firebaseApp from "../../auth/";
import {Status} from "../../models";

const useFetchBow = () => {
	const [status, setStatus] = useState<Status>(Status.Idle);
	const [bowType, setBowType] = useState<string | null>(null);
	const [error, setError] = useState<any | null>(null);

	const getBow = useCallback(() => {
		const auth = getAuth(firebaseApp);
		const db = getDatabase(firebaseApp);
		const userId = auth.currentUser ? auth.currentUser.uid : null;

		setStatus(Status.Pending);
		try {
			const dbRef = ref(db, "users/" + userId + "/profile");
			onValue(dbRef, (snapshot) => {
				const { bowType } = snapshot.val();
				setBowType(bowType);
				setStatus(Status.Idle);
			})
		} catch (e) {
			setError(e);
			setStatus(Status.Idle);
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
