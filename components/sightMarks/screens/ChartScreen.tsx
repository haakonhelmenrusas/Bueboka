import { ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { CalculatedMarks, MarksResult } from '@/types';
import { Message } from '@/components/common';
import { colors } from '@/styles/colors';

interface ChartScreenProps {
  calculatedMarks: MarksResult | null;
  marks: CalculatedMarks | null;
  setModalVisible: (visible: boolean) => void;
}

export default function ChartScreen({ calculatedMarks, marks: _marks, setModalVisible }: ChartScreenProps) {
  // Use the first available angle key (usually '0' for flat ground)
  const primaryAngleKey = calculatedMarks ? (Object.keys(calculatedMarks.sight_marks_by_hill_angle)[0] ?? '0') : '0';

  // Compute the axis ceiling from the maximum absolute mark value
  const getMaxAbsValue = (): number => {
    if (!calculatedMarks) return 30;
    const values = calculatedMarks.sight_marks_by_hill_angle[primaryAngleKey] ?? [];
    if (values.length === 0) return 30;
    return Math.ceil(Math.max(...values) * 1.15); // 15 % headroom
  };

  // Values are negated so the y-axis reads 0 at the top and increases downward
  const calculatedData = () => {
    if (!calculatedMarks || calculatedMarks.distances.length === 0) return [];
    const markValues = calculatedMarks.sight_marks_by_hill_angle[primaryAngleKey] ?? [];

    return calculatedMarks.distances.map((_distance, index) => {
      const abs = parseFloat(Number(markValues[index] ?? 0).toFixed(2));
      return { value: -abs, label: String(abs) };
    });
  };

  const maxAbsValue = getMaxAbsValue();
  const data = calculatedData();
  const xLabels = calculatedMarks?.distances.map((d) => `${d}m`) ?? [];

  const axisTextStyle = { color: colors.white, fontSize: 12 };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Message
            title="Ingen beregnede siktemerker"
            description="For å beregne siktemerker kan du trykke på knappen under."
            onPress={() => setModalVisible(true)}
            buttonLabel="Beregn siktemerker"
          />
        </View>
      ) : (
        <LineChart
          isAnimated
          curved
          // Axis range — negated so 0 sits at the top, values grow downward
          maxValue={0}
          mostNegativeValue={-maxAbsValue}
          noOfSectionsBelowXAxis={5}
          formatYLabel={(label) => String(Math.abs(Number(label)))}
          // Layout
          initialSpacing={30}
          spacing={50}
          height={300}
          // Calculated curve
          data={data}
          color1={colors.secondary}
          thickness={2}
          dataPointsRadius1={6}
          dataPointsColor1={colors.secondary}
          // x-axis distance labels
          xAxisLabelTexts={xLabels}
          xAxisLabelTextStyle={axisTextStyle}
          rotateLabel
          // Labels on curve dots — show positive absolute value
          showValuesAsDataPointsText
          textShiftY={-14}
          textShiftX={-10}
          textFontSize={12}
          textColor={colors.white}
          // Axis styling for gradient background
          yAxisColor={colors.white}
          xAxisColor={colors.white}
          yAxisTextStyle={axisTextStyle}
          showVerticalLines
          verticalLinesColor="rgba(255,255,255,0.15)"
          hideRules
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  emptyState: {
    padding: 16,
  },
});
