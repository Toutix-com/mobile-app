import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronLeft } from 'lucide-react-native';
import { AuthStackParamList } from '../../navigation/AuthStack';
import BlurredCirclesBackground from '../../components/layouts/BlurredCirclesBackground';
import { verifyOtp, loginWithOtp } from '../../services/ApiService';
import { handleOtpChange, handleKeyPress, handleVerify, handleResend, formatTime, timeLeft, setTimeLeft } from './store/otpVerify.store';
import { setUser, userStore } from '../login/store/login.store';
import * as Keychain from 'react-native-keychain';
import { LoginType } from '../login/enums/auth-enum';
import { useSignals } from '@preact/signals-react/runtime';
import { tokens, normalize } from '../../design-system';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;

interface OTPVerificationScreenProps {
  route: {
    params: {
      email?: string;
      mobileNumber?: string;
      type: LoginType;
    };
  };
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ route }) => {
  useSignals();
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    setUser({
      ...userStore.value,
      otp: Array(6).fill(''),
    });
  }, []);

  useEffect(() => {
    if (timeLeft.value > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft.value - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft.value]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <BlurredCirclesBackground>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ChevronLeft color={tokens.colors.textInverse} size={24} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logos/toutix_logo_full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Find It, Book It, Live It</Text>
      </View>

        <View style={styles.card}>
          <Text style={styles.title}>Verify your {route.params.type === LoginType.EMAIL ? 'email' : 'mobile number'}</Text>
          <Text style={styles.subtitle}>
            We've sent a code to {route.params.type === LoginType.EMAIL ? route.params.email : route.params.mobileNumber}
          </Text>

          <View style={styles.otpContainer}>
            {userStore.value.otp?.map((digit: string, index: number) => (
              <React.Fragment key={index}>
                <TextInput
                  ref={(ref) => {
                    if (ref) {
                      inputRefs.current[index] = ref;
                    }
                  }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index, inputRefs.current)}
                  onKeyPress={(e) => handleKeyPress(e, index, inputRefs.current)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoComplete="off"
                  textContentType="oneTimeCode"
                />
                {index === 2 && <Text style={styles.otpSeparator}>-</Text>}
              </React.Fragment>
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              userStore.value.otp?.every((d: string) => d) && styles.verifyButtonActive
            ]} 
            onPress={() => handleVerify(route, navigation)}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't get the code?</Text>
            <TouchableOpacity onPress={() => handleResend(route, setTimeLeft, timeLeft.value)} disabled={timeLeft.value > 0}>
              <Text style={[styles.resendButton, timeLeft.value > 0 && styles.resendButtonDisabled]}>
                Resend {timeLeft.value > 0 ? `in ${formatTime(timeLeft.value)}` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
     
    </BlurredCirclesBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(50) : normalize(50),
    left: normalize(20),
    width: normalize(40),
    height: normalize(40),
    borderRadius: tokens.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(120) : normalize(120),
    marginBottom: normalize(40),
  },
  logo: {
    width: normalize(150),
    height: normalize(35),
    tintColor: tokens.colors.textInverse,
  },
  tagline: {
    color: tokens.colors.textInverse,
    fontSize: normalize(tokens.typography.fontSize['3xl']),
    fontWeight: tokens.typography.fontWeight.bold,
    marginTop: normalize(20),
    textAlign: 'center',
  },
  card: {
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: normalize(24),
    borderTopRightRadius: normalize(24),
    padding: normalize(24),
    flex: 1,
  },
  title: {
    fontSize: normalize(tokens.typography.fontSize['3xl']),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text,
    marginBottom: normalize(12),
  },
  subtitle: {
    fontSize: normalize(tokens.typography.fontSize.base),
    color: tokens.colors.textSecondary,
    marginBottom: normalize(32),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  otpInput: {
    width: normalize(45),
    height: normalize(45),
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.default,
    textAlign: 'center',
    fontSize: normalize(tokens.typography.fontSize.xl),
    marginHorizontal: normalize(4),
    color: tokens.colors.text,
    backgroundColor: tokens.colors.background,
  },
  otpInputFilled: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.surface,
  },
  otpSeparator: {
    fontSize: normalize(tokens.typography.fontSize['2xl']),
    color: tokens.colors.textSecondary,
    marginHorizontal: normalize(8),
  },
  verifyButton: {
    backgroundColor: tokens.colors.primary,
    opacity: 0.5,
    borderRadius: tokens.borderRadius.full,
    padding: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  verifyButtonActive: {
    opacity: 1,
  },
  verifyButtonText: {
    color: tokens.colors.textInverse,
    fontSize: normalize(tokens.typography.fontSize.base),
    fontWeight: tokens.typography.fontWeight.bold,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: normalize(16),
  },
  resendText: {
    color: tokens.colors.textSecondary,
    fontSize: normalize(tokens.typography.fontSize.sm),
    marginBottom: normalize(16),
  },
  resendButton: {
    color: tokens.colors.primary,
    fontSize: normalize(tokens.typography.fontSize.sm),
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default OTPVerificationScreen; 