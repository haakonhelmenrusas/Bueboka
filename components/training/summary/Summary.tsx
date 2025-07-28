import { View, Text } from "react-native";
import { styles } from "./SummaryStyles";
import { Training } from "@/types";
import { sumArrows } from "../helpers/sumArrows";

interface SummaryProps {
  trainings: Training[];
}
export default function Summary({ trainings }: SummaryProps) {
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