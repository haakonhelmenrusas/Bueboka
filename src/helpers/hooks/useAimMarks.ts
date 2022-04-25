import { useState } from "react";
import {IAimDistance} from "../../components/forms/calculateForm/CalculateForm";

const aimMarksAPICall = (body: IAimDistance[]) => {
	return fetch('https://calculate-aim.azurewebsites.net/api/archerAim', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: "POST",
		body: JSON.stringify(body),
	})
}

const useAimMarks = () => {
	const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
	const [error, setError] = useState<any | null>(null);


	const sendAimMarks = async (body: IAimDistance[]): Promise<void> => {
		try {
			setStatus("pending");
			const result = await aimMarksAPICall(body);
		} catch (error) {
			setStatus("error");
		} finally {
			setStatus("idle");
		}
	};

	return {
		status,
		error,
		sendAimMarks,
	};
};

export default useAimMarks;
