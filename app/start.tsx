import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedButton } from "@/components/ThemedButton";

export default function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dépasse tes limites à chaque foulée !</Text>
      <Text>Transforme chaque course en séance de coaching personnalisée</Text>

      <ThemedButton
        title="Sign In"
        onPress={() => router.push('/sign-in')}
      />
      <Text style={{ fontSize: '11px' }}>Déjà un compte ? <Text style={{ textDecorationLine: 'underline' }}>Se connecter</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  button: {
    marginTop: 16,
  },
});
