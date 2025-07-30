import { View, Text } from "react-native";
import { Training } from "@/types";
import { Button } from "../common";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { styles } from "./TrainingCardStyles";


interface TrainingCardProps {
  training: Training;
}
export default function TrainingCard({ training }: TrainingCardProps) {
  return (
    <View >
      <View>
        <Text>{training.date.toDateString()}</Text>
        <Text>{training.arrows} piler</Text>
        <Button label="" onPress={() => {}}> <FontAwesomeIcon style={styles.icon} icon={faInfoCircle} /></Button>
      </View>
      
    </View>
  );
}