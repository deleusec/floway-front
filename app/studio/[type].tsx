import BackButton from '@/components/button/BackButton';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StudioByType() {
  const navigation = useLocalSearchParams();
  console.log(navigation);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <BackButton />
          </View>
          <View style={styles.iconContainer}>
            <TabBarIcon name="information-circle-outline" color={Colors.dark.primary} />
          </View>
        </View>

        <ThemedText type="title">Mes audios</ThemedText>
        <ThemedText type="legend" style={ styles.audiosEmpty}>Aucun audio n’a été ajouté.
        Créez ou importez le votre en cliquant ci-dessous !</ThemedText>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audiosEmpty: {
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
