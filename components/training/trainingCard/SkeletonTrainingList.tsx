import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../trainingList/TrainingListStyles';
import SkeletonTrainingCard from './SkeletonTrainingCard';

export default function SkeletonTrainingList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste av treninger</Text>
      <ScrollView>
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonTrainingCard key={index} />
        ))}
      </ScrollView>
    </View>
  );
}
