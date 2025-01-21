import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import TimeInputField from '@/components/input/TimeInput';
import SelectInput from '@/components/input/SelectInput';
import { Colors } from '@/constants/Colors';

const timeOptions = ['Temps', 'Distance'];
const distanceOptions = ['Mètres', 'Kilomètres'];

export default function InputComponentsDemo() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Components Demo</Text>

        {/* Time Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Input Fields</Text>

          <View style={styles.demoSection}>
            <Text style={styles.stateTitle}>Active State</Text>
            <View style={styles.row}>
              <TimeInputField placeholder="00" unit="heures" value="1" onChange={(value) => console.log(value)} />
              <TimeInputField placeholder="00" unit="min" value="30" onChange={(value) => console.log(value)} />
              <TimeInputField placeholder="00" unit="sec" value="45" onChange={(value) => console.log(value)} />
            </View>
          </View>

          <View style={styles.demoSection}>
            <Text style={styles.stateTitle}>Disabled State</Text>
            <View style={styles.row}>
              <TimeInputField placeholder="00" unit="heures" status="deactivate" value="1" onChange={(value) => console.log(value)} />
              <TimeInputField placeholder="00" unit="min" status="deactivate" value="30" onChange={(value) => console.log(value)} />
              <TimeInputField placeholder="00" unit="sec" status="deactivate" value="45" onChange={(value) => console.log(value)} />
            </View>
          </View>

          <View style={styles.demoSection}>
            <Text style={styles.stateTitle}>Error State</Text>
            <View style={styles.row}>
              <TimeInputField placeholder="00" unit="heures" status="error" value="" onChange={(value) => console.log(value)} />
              <TimeInputField placeholder="00" unit="min" status="error" value="" onChange={(value) => console.log(value)} />
              <TimeInputField placeholder="00" unit="sec" status="error" value="" onChange={(value) => console.log(value)} />
            </View>
          </View>
        </View>

        {/* Select Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Input Fields</Text>

          <View style={styles.demoSection}>
            <Text style={styles.stateTitle}>Active State</Text>
            <View style={styles.selectContainer}>
              <SelectInput
                options={timeOptions}
                placeholder="Sélectionner le type"
                label="Type de mesure"
              />
            </View>
            <View style={styles.selectContainer}>
              <SelectInput
                options={distanceOptions}
                placeholder="Sélectionner l'unité"
                label="Unité"
              />
            </View>
          </View>

          <View style={styles.demoSection}>
            <Text style={styles.stateTitle}>Disabled State</Text>
            <View style={styles.selectContainer}>
              <SelectInput
                options={timeOptions}
                placeholder="Sélectionner le type"
                status="disabled"
                label="Type de mesure"
              />
            </View>
          </View>

          <View style={styles.demoSection}>
            <Text style={styles.stateTitle}>Error State</Text>
            <View style={styles.selectContainer}>
              <SelectInput
                options={timeOptions}
                placeholder="Sélectionner le type"
                status="error"
                label="Type de mesure"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primaryDark,
  },
  content: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.white,
    marginBottom: 32,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.white,
    marginBottom: 24,
  },
  demoSection: {
    marginBottom: 24,
  },
  stateTitle: {
    fontSize: 16,
    color: Colors.light.mediumGrey,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
  },
  selectContainer: {
    marginBottom: 16,
    maxWidth: 400,
  },
});
