import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {Spacing, Colors, FontSize, Radius} from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import InputLabel from '@/components/ui/input/label';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Title from '@/components/ui/title';

const schema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Minimum 6 caractères' }),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // Validation manuelle avec toasts
    if (!data.email) {
      Toast.show({
        type: 'error',
        text1: 'Email requis',
        text2: 'Saisis ton adresse e-mail',
      });
      return;
    }
    
    if (!data.email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Email invalide',
        text2: 'Ton adresse e-mail n’est pas valide',
      });
      return;
    }
    
    if (!data.password) {
      Toast.show({
        type: 'error',
        text1: 'Mot de passe invalide',
        text2: 'Saisis ton mot de passe',
      });
      return;
    }

    try {
      const success = await login(data.email, data.password);
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Connexion réussie',
          text2: 'Bienvenue sur Floway !',
        });
        router.replace('/');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oups !',
          text2: 'Email ou mot de passe incorrect',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Oups !',
        text2: 'Impossible de te connecter. Réessaie.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          <Image
            source={require('@/assets/images/runners-holding-hands.png')}
            style={styles.image}
            resizeMode='contain'
          />
          <View style={styles.formContainer}>
            <Title style={styles.title}>Se connecter</Title>

            <View style={styles.field}>
              <InputLabel>Email</InputLabel>
              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    placeholder='Ex : john.doe@mail.fr'
                  />
                )}
              />
            </View>

            <View style={styles.field}>
              <InputLabel>Mot de passe</InputLabel>
              <Controller
                control={control}
                name='password'
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    autoCapitalize='none'
                    placeholder='Votre mot de passe'
                  />
                )}
              />
            </View>

            <Button
              title={isSubmitting ? 'Connexion...' : 'Se connecter'}
              onPress={handleSubmit(onSubmit)}
              size='large'
              width='full'
              rounded='full'
              state={isSubmitting ? 'disabled' : 'default'}
              style={{ marginTop: Spacing.lg, marginBottom: Spacing.md }}
            />

            <Text style={styles.registerText}>
              Pas encore de compte ?{' '}
              <Text style={styles.registerLink} onPress={() => router.push('/auth/register')}>
                S’inscrire
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.md,
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  formContainer: {
    gap: Spacing.md,
  },
  field: {
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    fontSize: FontSize.md,
    backgroundColor: Colors.white,
  },
  error: {
    color: Colors.error,
    marginBottom: Spacing.sm,
    fontSize: FontSize.sm,
  },
  registerText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  registerLink: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
