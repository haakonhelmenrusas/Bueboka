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
        <View style={styles.textLine}><Text style={styles.subtitle}>Siste 7 dagene </Text> <Text style={styles.arrowCount}> {sumArrows(trainings, "7days")} </Text></View>
        <View style={styles.textLine}><Text style={styles.subtitle}>Denne måneden </Text> <Text style={styles.arrowCount}> {sumArrows(trainings, "month")} </Text></View>
        <View style={styles.textLine}><Text style={styles.subtitle}>Totalt </Text> <Text style={styles.arrowCount}> {sumArrows(trainings)} </Text></View>
      </View>
      
    </View>
  );
}