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
import GradientLayout from '../../components/layouts/GradientLayout';
import { verifyOtp, loginWithOtp } from '../../services/ApiService';
import { handleOtpChange, handleKeyPress, handleVerify, handleResend, formatTime, timeLeft, setTimeLeft } from './store/otpVerify.store';
import { setUser, userStore } from '../login/store/login.store';
import * as Keychain from 'react-native-keychain';
import { LoginType } from '../login/enums/auth-enum';
import { useSignals } from '@preact/signals-react/runtime';

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
    <GradientLayout>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ChevronLeft color="#FFFFFF" size={24} />
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
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We've sent a code to {route.params.email}
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
     
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 120 : 120,
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 35,
    tintColor: '#FFFFFF',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 4,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#06053A',
    backgroundColor: '#F8F9FA',
  },
  otpSeparator: {
    fontSize: 24,
    color: '#666666',
    marginHorizontal: 8,
  },
  verifyButton: {
    backgroundColor: '#06053A',
    opacity: 0.5,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonActive: {
    opacity: 1,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 8,
  },
  resendButton: {
    color: '#06053A',
    fontSize: 14,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default OTPVerificationScreen; 