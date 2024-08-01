import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { CalculatedMarks, MarksResult } from '@/types';
import { Message } from '@/components/common';

interface ChartScreenProps {
  calculatedMarks: MarksResult;
  marks: CalculatedMarks;
  setModalVisible: (visible: boolean) => void;
}

export default function ChartScreen({ calculatedMarks, marks, setModalVisible }: ChartScreenProps) {
  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 12,
          height: 12,
          backgroundColor: 'white',
          borderWidth: 3,
          borderRadius: 6,
          borderColor: '#07BAD1',
        }}
      />
    );
  };

  const customLabel = (val: number) => {
    return (
      <View style={{ width: 64, marginLeft: 16 }}>
        <Text style={{ color: '#053546', fontWeight: '500' }}>{val}m</Text>
      </View>
    );
  };

  const calculatedData = () => {
    if (!calculatedMarks) return [];
    if (calculatedMarks.distances.length <= 0) return [];

    return calculatedMarks.distances.map((distance, index) => {
      let value = Number(calculatedMarks.sight_marks_by_hill_angle['0'][index]);
      let mark = parseFloat(value.toFixed(2));

      return {
        value: mark,
        labelComponent: () => customLabel(distance),
        customLabel: customLabel,
      };
    });
  };

  const marksData = () => {
    if (!marks) return [];
    if (marks.given_marks.length <= 0) return [];

    return calculatedMarks.distances
      .map((distance) => {
        const calculatedIndex = marks.given_distances.indexOf(distance);
        if (calculatedIndex === -1)
          return {
            value: 0,
            customDataPoint: () => <View />,
          };

        let value = Number(marks.calculated_marks[calculatedIndex]);
        let mark = parseFloat(value.toFixed(2));

        return {
          value: mark,
          customDataPoint: customDataPoint,
          customLabel: customLabel,
        };
      })
      .filter((dataPoint) => dataPoint !== null);
  };

  return (
    <ScrollView style={styles.page}>
      {calculatedData().length === 0 ? (
        <View style={{ marginTop: 'auto', padding: 16 }}>
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
          initialSpacing={30}
          textShiftY={-12}
          textShiftX={-12}
          textFontSize={14}
          textColor="#053546"
          showVerticalLines
          hideRules
          showValuesAsDataPointsText
          hideDataPoints1
          spacing={50}
          height={400}
          data={calculatedData()}
          data2={marksData()}
          color2="#FFF"
          thickness={2}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: 16,
    minHeight: '60%',
    padding: 8,
    backgroundColor: '#FFF',
  },
});
