import {useState} from "react";

import {IAimDistanceMark, ICalculatedMarks, Status} from "../../models";

const aimMarksAPICall = (body: IAimDistanceMark) => {
	return fetch('https://calculate-aim.azurewebsites.net/api/archerAim', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: "POST",
		body: JSON.stringify(body),
	})
}

const useAimMarks = () => {
	const [status, setStatus] = useState<Status>(Status.Idle);
	const [error, setError] = useState<any | null>(null);

	const sendAimMarks = async (body: IAimDistanceMark): Promise<ICalculatedMarks | undefined> => {
		try {
			setStatus(Status.Pending);
			const result = await aimMarksAPICall(body);
			if (result.ok) {
				return result.json();
			}
		} catch (error) {
			setStatus(Status.Error);
			setError(error);
		} finally {
			setStatus(Status.Idle);
		}
	};

	return {
		status,
		error,
		sendAimMarks,
	};
};

export default useAimMarks;
