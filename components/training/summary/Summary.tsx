import { View, Text } from "react-native";
import { styles } from "./SummaryStyles";
import { Training } from "@/types";

const trainings: Training[] = [{date: new Date("2025-06-29"), arrows: 83}, {date: new Date("2025-06-30"), arrows: 80}, {date: new Date("2025-07-03"), arrows: 67}, {date: new Date("2025-06-02"), arrows: 53}]

export default function Summary() {
  console.log(Date())
  function sumArrows(trainings: Training[], period?: string) {
    let today = new Date();
    let filteredTrainings: Training[] = trainings;
    if (period === "month") {
        filteredTrainings = trainings.filter((training) => training.date.getMonth() === today.getMonth());
    } else if (period === "7days") {
        const date = new Date();
        date.setDate(today.getDate() - 7);
        filteredTrainings = trainings.filter((training) => training.date > date);
    }
    let total = 0
    for (var t of filteredTrainings) {
        total += t.arrows;
    }

    return total;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Oppsummering</Text>
        <Text>Siste 7 dagene: {sumArrows(trainings, "7days")} </Text>
        <Text>Denne måneden: {sumArrows(trainings, "month")} </Text>
        <Text>Totalt: {sumArrows(trainings)} </Text>
      </View>
      
    </View>
  );
}