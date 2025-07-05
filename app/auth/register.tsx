import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Text
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import { Spacing, Colors, FontSize, FontFamily } from '@/constants/theme';
import { useAuth } from '@/stores/auth';

import InputLabel from '@/components/ui/input/label';
import InputError from '@/components/ui/input/error';
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const success = await registerUser(data);
    if (success) {
      Alert.alert('Compte créé', 'Vous pouvez maintenant vous connecter.');
      router.replace('/auth/login');
    } else {
      Alert.alert('Erreur', 'Email déjà utilisé ou autre problème.');
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
              <InputError message={errors.first_name?.message} />
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
              <InputError message={errors.last_name?.message} />
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
              <InputError message={errors.username?.message} />
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
              <InputError message={errors.email?.message} />
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
              <InputError message={errors.password?.message} />
            </View>

            <Button
              title={isSubmitting ? 'Création...' : 'Créer le compte'}
              onPress={handleSubmit(onSubmit)}
              size='large'
              width='full'
              rounded='full'
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
    fontFamily: FontFamily.medium,
    textDecorationLine: 'underline',
  },
});
