import { router } from 'expo-router';
import { Text, SafeAreaView, StyleSheet, View, Image } from 'react-native';
import React from "react";
import { Colors, FontSize, Spacing } from "@/theme";
import Button from "@/components/ui/button";

export default function Index() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Image Section */}
          <Image
            source={require("@/assets/images/runners_hill.png")}
            style={styles.image}
          />
        {/* Content Section */}
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Floway</Text>
              <Text style={styles.subtitle}>Courez avec les voix qui vous portent.</Text>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>Prêt à commencer ton aventure ?</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title='Se connecter'
                  width='full'
                  size='large'
                  onPress={() => router.push('/auth/login')}
                />
                <Button
                  title='Créer un compte'
                  variant='outline'
                  width='full'
                  size='large'
                  onPress={() => router.push('/auth/register')}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Image Section
  image: {
    width: '100%',
    flex: 1,
  },

  // Content Section
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },

  // Header Section
  headerSection: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.primary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FontSize.lg,
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: FontSize.lg * 1.3,
    maxWidth: 280,
  },

  // CTA Section
  ctaSection: {
    paddingBottom: Spacing.xl,
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
    alignItems: 'center',
  },
})
