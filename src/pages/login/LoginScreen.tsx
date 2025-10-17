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
import GradientLayout from '../../components/layouts/GradientLayout';
import GoogleIcon from '@assets/icons/google.svg';
import AppleIcon from '@assets/icons/apple.svg';
import GoogleSignInService from '../../services/GoogleSignInService';
import AppleSignInService from '../../services/AppleSignInService';
import { setUser, userStore, handleGoogleSignIn, handleAppleSignIn, handleContinue, setShowAuthStack } from './store/login.store';
import { useSignal } from '@preact/signals-react';
import { Button, AppText, Icon } from '../../components';
import { X } from 'lucide-react-native';
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
    <GradientLayout>
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
            placeholderTextColor="#A0A0A0"
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
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 50,
    left: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 120 : 120,
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.45,
    height: 35,
    tintColor: '#FFFFFF',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: 44,
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
  },
  description:{
    fontSize: 14,
    fontWeight: '400',
    color: '#5C636E',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1E1B4B',
    borderColor: '#1E1B4B',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
  },
  loginButton: {
    marginBottom: 16,
    marginTop: '20%',
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1E1B4B',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 12,
  },
  socialTextWithIcon: {
    marginLeft: 12,
  },
  socialPrefix: {
    color: '#666666',
  },
});

export default LoginScreen; 