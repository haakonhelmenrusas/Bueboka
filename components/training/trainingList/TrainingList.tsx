import { Training } from "@/types";
import { View, Text } from "react-native";
import { styles } from "./TrainingListStyles";
import TrainingCard from "@/components/trainingCard/TrainingCard";
import { Message } from "@/components/common";
import { isSameDay } from 'date-fns';


interface TrainingListProps {
  trainings: Training[];
}

export default function TrainingList({ trainings }: TrainingListProps) {
  const renderTrainingList = () => {
    if (trainings && trainings.length > 0) {
      let today = new Date();
      return (
        <>
          <Text style={styles.title}>Liste av treninger</Text>
          {trainings.map((training, index) =>
            isSameDay(today, training.date) ? (
              <View key={index}>
                <Text >Dagens trening:</Text>
                <TrainingCard training={training} />
                <Text> Eldre treninger:</Text>
              </View>
            ) : (
              <TrainingCard key={index} training={training} />
            )
          )}
        </>
      );
    } else {
      return <Message title="Ingen treninger" description="Legg til treninger ved å trykke på 'Ny trening'" />;
    }
  }
  return (
    <View style={styles.container}>
      {renderTrainingList()}
    </View>
  );
}