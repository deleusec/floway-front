import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Text
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Spacing, Colors, FontSize } from '@/constants/theme';
import { useAuth } from '@/stores/auth';

import InputLabel from '@/components/ui/input/label';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Title from '@/components/ui/title';

const schema = z.object({
  first_name: z.string().min(1, 'Prénom requis'),
  last_name: z.string().min(1, 'Nom requis'),
  username: z.string().min(1, 'Nom d\'utilisateur requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // Validation manuelle avec toasts
    if (!data.first_name) {
      Toast.show({
        type: 'error',
        text1: 'Prénom requis',
        text2: 'Entre ton prénom',
      });
      return;
    }
    
    if (!data.last_name) {
      Toast.show({
        type: 'error',
        text1: 'Nom requis',
        text2: 'Entre ton nom',
      });
      return;
    }
    
    if (!data.username) {
      Toast.show({
        type: 'error',
        text1: 'Nom d\'utilisateur requis',
        text2: 'Choisis un nom d’utilisateur',
      });
      return;
    }
    
    if (!data.email) {
      Toast.show({
        type: 'error',
        text1: 'Email requis',
        text2: 'Entre ton adresse email',
      });
      return;
    }
    
    if (!data.email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Email invalide',
        text2: 'Vérifie ton adresse email',
      });
      return;
    }
    
    if (!data.password || data.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Mot de passe trop court',
        text2: 'Utilise au moins 6 caractères',
      });
      return;
    }

    try {
      const success = await registerUser(data);
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Compte créé',
          text2: 'Tu peux maintenant te connecter',
        });
        router.replace('/auth/login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oups ! Impossible de créer le compte',
          text2: 'Email déjà utilisé. Contacte nous par mail si besoin.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur inconnue',
        text2: 'Une erreur est survenue lors de la création du compte',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Title style={styles.title}>
            Créer un compte
          </Title>

          <View style={styles.form}>
            <View style={styles.field}>
              <InputLabel>Prénom</InputLabel>
              <Controller
                control={control}
                name='first_name'
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder='Ex: John'
                  />
                )}
              />
            </View>

            <View style={styles.field}>
              <InputLabel>Nom</InputLabel>
              <Controller
                control={control}
                name='last_name'
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder='Ex: Doe'
                  />
                )}
              />
            </View>

            <View style={styles.field}>
              <InputLabel>Nom d'utilisateur</InputLabel>
              <Controller
                control={control}
                name='username'
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder='Ex: john.doe'
                  />
                )}
              />
            </View>

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
                    placeholder='Ex: john.doe@gmail.com'
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
              title={isSubmitting ? 'Création...' : 'Créer le compte'}
              onPress={handleSubmit(onSubmit)}
              size='large'
              width='full'
              rounded='full'
              state={isSubmitting ? 'disabled' : 'default'}
              style={{ marginTop: Spacing.lg, marginBottom: Spacing.md }}
            />

            <Text style={styles.loginText}>
              Déjà un compte ?{' '}
              <Text style={styles.loginLink} onPress={() => router.push('/auth/login')}>
                Se connecter
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
    height: 300,
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.md,
  },
  field: {
    gap: Spacing.sm,
  },
  loginText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  loginLink: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
