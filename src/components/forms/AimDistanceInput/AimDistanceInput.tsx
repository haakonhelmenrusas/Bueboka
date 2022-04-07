import React from "react";
import {NumberInput, TextInput} from "@mantine/core";

import styles from "./AimDistanceInput.module.css";
import {IAimDistance} from "../calculateForm/CalculateForm";

interface IAimDistanceInput {
	input: IAimDistance;
	onchange: any;
}

const AimDistanceInput: React.FC<IAimDistanceInput> = ({ input, onchange }) => {

	return (
		<div className={styles.fieldGroup}>
			<TextInput label="Avstand" value={input.distance} />
			<NumberInput value={input.mark} onChange={onchange} />		</div>
	)
}
export default AimDistanceInput;
