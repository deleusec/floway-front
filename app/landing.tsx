import {router} from 'expo-router';
import {Text, SafeAreaView, StyleSheet, View} from 'react-native';
import React from "react";
import {Colors, FontSize, Spacing} from "@/theme";
import RunnersHill from "@/components/icons/RunnersHill";
import Button from "@/components/ui/button";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <RunnersHill />
      <View>
        <Text style={styles.title}>Floway</Text>
        <Text style={styles.subtitle}>Cours avec du flow, pas juste des stats ✨</Text>
      </View>
      <View style={styles.buttons}>
        <Button title='Se connecter' width='full' size='large' onPress={() => router.push('/auth/login')} />
        <Button title='Créer un compte' variant='outline' onPress={() => router.push('/auth/register')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  image: {
    width: '100%',
    height: 395,
    marginBottom: Spacing.lg,
  },
  buttons: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
    color: Colors.primary,
    paddingHorizontal: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
})
