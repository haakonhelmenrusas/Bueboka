import { Training } from "@/types";
import { View, Text } from "react-native";
import { styles } from "./TrainingListStyles";
import TrainingCard from "@/components/trainingCard/TrainingCard";
import { Message } from "@/components/common";
import { isSameDay } from 'date-fns';
import { ScrollView } from "react-native-gesture-handler";


interface TrainingListProps {
  trainings: Training[];
}

export default function TrainingList({ trainings }: TrainingListProps) {
  const renderTrainingList = () => {
    if (trainings && trainings.length > 0) {
      let today = new Date();
      return (
        <>
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
      <Text style={styles.title}>Liste av treninger</Text>
    <ScrollView >
      {renderTrainingList()}
    </ScrollView>
    </View>
  );
}