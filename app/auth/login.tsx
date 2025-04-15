import React from 'react';
import { View, Text, Image, StyleSheet, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Spacing, Colors, FontSize, FontFamily } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import InputError from '@/components/ui/input/error';
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.replace('/');
    } else {
      Alert.alert('Erreur', 'Identifiants invalides');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('@/assets/images/runners-holding-hands.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.formContainer}>
            <Title style={styles.title}>Se connecter</Title>

            <View style={styles.field}>
              <InputLabel>Email</InputLabel>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              <InputError message={errors.email?.message} />
            </View>

            <View style={styles.field}>
              <InputLabel>Mot de passe</InputLabel>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
              />
              <InputError message={errors.password?.message} />
            </View>

            <Button
              title={isSubmitting ? 'Connexion...' : 'Se connecter'}
              onPress={handleSubmit(onSubmit)}
              size="large"
              width="full"
              rounded="md"
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
    height: 300,
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
    gap: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
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
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  registerLink: {
    fontFamily: FontFamily.medium,
    textDecorationLine: 'underline',
    color: Colors.textPrimary,
  },
});
