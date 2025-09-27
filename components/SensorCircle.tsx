// components/SensorCircle.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color: string;
}

export const SensorCircle: React.FC<Props> = ({
  value,
  label,
  unit,
  color,
}) => {
  return (
    <View style={[styles.circle, { borderColor: color }]}>
      <Text style={[styles.value, { color }]}>{value}{unit}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
});
