import React, { useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import BlurredCirclesBackground from '../../components/layouts/BlurredCirclesBackground';
import GoogleIcon from '@assets/icons/google.svg';
import AppleIcon from '@assets/icons/apple.svg';
import GoogleSignInService from '../../services/GoogleSignInService';
import AppleSignInService from '../../services/AppleSignInService';
import { setUser, userStore, handleGoogleSignIn, handleAppleSignIn, handleContinue, setShowAuthStack } from './store/login.store';
import { useSignal } from '@preact/signals-react';
import { Button, AppText, Icon } from '../../components';
import { X } from 'lucide-react-native';
import { tokens, getSpacing, normalize } from '../../design-system';
type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  console.log("userStore", userStore.value);
  useSignal();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    GoogleSignInService.init();
  }, []);

  return (
    <BlurredCirclesBackground>
      <Icon 
        icon={<X />}
        size={20}
        color="#FFFFFF"
        backgroundColor="rgba(255, 255, 255, 0.15)"
        rounded
        padding={12}
        style={styles.closeButton}
        onPress={() => setShowAuthStack(false)}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logos/toutix_logo_full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AppText style={styles.tagline}>Find It, Book It, Live It</AppText>
      </View>

      <View style={styles.formContainer}>
        <AppText style={styles.title}>Log in or sign up</AppText>
        
        <View style={styles.inputContainer}>
          <AppText style={styles.label}>Email or mobile</AppText>
          <TextInput
            style={styles.input}
            placeholder="Email/ mobile number"
            placeholderTextColor={tokens.colors.textSecondary}
            value={userStore?.value.email}
            onChangeText={(e) => {
              setUser({
                ...userStore.value,
                email: e,
              });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!userStore.value.isLoading}
          />
        </View>
        <AppText style={styles.description}>We'll send you a code to log in to your account</AppText>
        
        <Button 
          title="Continue"
          loading={userStore.value.isLoading}
          disabled={userStore.value.isLoading}
          onPress={() => handleContinue(navigation)}
          fullWidth
          style={styles.loginButton}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <AppText style={styles.dividerText}>Or</AppText>
          <View style={styles.divider} />
        </View>

        <Button 
          title={userStore.value.isLoading ? 'Connecting...' : 'Continue with Google'}
          variant="social"
          leftIcon={<GoogleIcon width={20} height={20} />}
          loading={userStore.value.isLoading}
          disabled={userStore.value.isLoading}
          onPress={() => handleGoogleSignIn(navigation)}
          fullWidth
          style={styles.socialButton}
        />
        <Button 
          title={userStore.value.isLoading ? 'Connecting...' : 'Continue with Apple'}
          variant="social"
          leftIcon={<AppleIcon width={20} height={20} />}
          loading={userStore.value.isLoading}
          disabled={userStore.value.isLoading}
          onPress={() => handleAppleSignIn(navigation)}
          fullWidth
          style={styles.socialButton}
        />
      </View>
    </BlurredCirclesBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(50) : normalize(50),
    left: normalize(20),
    width: normalize(40),
    height: normalize(40),
    borderRadius: tokens.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: tokens.colors.textInverse, // Using semantic color - white text on dark background
    fontSize: normalize(tokens.typography.fontSize.lg),
    fontWeight: tokens.typography.fontWeight.normal,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(120) : normalize(120),
    paddingHorizontal: normalize(20),
  },
  logo: {
    width: width * 0.45,
    height: normalize(35),
    tintColor: tokens.colors.textInverse, // Using semantic color - white logo on dark background
  },
  tagline: {
    color: tokens.colors.textInverse, // Using semantic color - white text on dark background
    fontSize: normalize(tokens.typography.fontSize['3xl']),
    fontWeight: tokens.typography.fontWeight.bold,
    marginTop: normalize(14),
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: tokens.colors.background, // Using semantic color
    borderTopLeftRadius: normalize(24),
    borderTopRightRadius: normalize(24),
    padding: normalize(24),
    marginTop: normalize(44),
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? normalize(34) : normalize(24),
  },
  title: {
    fontSize: normalize(tokens.typography.fontSize['2xl']),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text, // Using semantic color
    marginBottom: normalize(24),
  },
  description: {
    fontSize: normalize(tokens.typography.fontSize.sm),
    fontWeight: tokens.typography.fontWeight.normal,
    color: tokens.colors.textSecondary, // Using semantic color
    marginBottom: normalize(24),
  },
  inputContainer: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(tokens.typography.fontSize.base),
    color: tokens.colors.text, // Using semantic color
    marginBottom: normalize(8),
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border, // Using semantic color
    borderRadius: tokens.borderRadius.default,
    padding: normalize(16),
    fontSize: normalize(tokens.typography.fontSize.base),
    color: tokens.colors.text, // Using semantic color
  },
  loginButton: {
    backgroundColor: tokens.colors.primary, // Using semantic color
    borderRadius: tokens.borderRadius.full,
    padding: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(24),
    marginTop: '20%',
  },
  loginButtonText: {
    color: tokens.colors.textInverse, // Using semantic color
    fontSize: normalize(tokens.typography.fontSize.base),
    fontWeight: tokens.typography.fontWeight.bold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.colors.border, // Using semantic color
  },
  dividerText: {
    color: tokens.colors.textSecondary, // Using semantic color
    paddingHorizontal: normalize(12),
    fontSize: normalize(tokens.typography.fontSize.sm),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.borderRadius.full,
    padding: normalize(12),
    paddingHorizontal: normalize(16),
    marginBottom: normalize(12),
    borderColor: tokens.colors.primary, // Using semantic color
    borderWidth: 1,
    flex: 1,
    marginHorizontal: normalize(3),
  },
  socialButtonText: {
    fontSize: normalize(tokens.typography.fontSize.base),
    color: tokens.colors.primary, // Using semantic color
    fontWeight: tokens.typography.fontWeight.medium,
    marginLeft: normalize(12),
  },
});

export default LoginScreen; 