import React, { useState, useEffect, useRef } from 'react';
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
import { AuthStackParamList } from '../navigation/AuthStack';
import GradientLayout from '../components/layouts/GradientLayout';
import { verifyOtp, loginWithOtp } from '../services/ApiService';
import { rootStore, setUser } from '../store/rootStore';
import * as Keychain from 'react-native-keychain';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;

interface OTPVerificationScreenProps {
  route: {
    params: {
      email?: string;
      mobileNumber?: string;
      type: 'email' | 'mobile';
    };
  };
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ route }) => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const store = rootStore.value;
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const digits = value.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    try {
      const res = await verifyOtp({ email: route.params.email || '', otp: otpString });
      if (res && res.status === 200 && res.data) {
        setUser({
          ...rootStore.value.user,
          isNewUser: res.data.isNewUser,
          role: res.data.role,
          isAuthenticated: res.data.isNewUser ? false : true
        });
        await Keychain.setGenericPassword('auth', res.data.token);
        res.data.isNewUser && navigation.navigate('Register');
      } else {
        Alert.alert('Error', res?.message || 'Invalid OTP');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to verify OTP');
    }
  };

  const handleResend = async () => {
    if (timeLeft === 0) {
      try {
        if (route.params.type === 'email' && route.params.email) {
          await loginWithOtp({ email: route.params.email });
        } else if (route.params.type === 'mobile' && route.params.mobileNumber) {
          await loginWithOtp({ mobileNumber: route.params.mobileNumber });
        }
        setTimeLeft(45);
        Alert.alert('Success', 'OTP resent successfully');
      } catch (e) {
        Alert.alert('Error', 'Failed to resend OTP');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GradientLayout>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ChevronLeft color="#FFFFFF" size={24} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logos/toutix_logo_full.png')}
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
            {otp.map((digit, index) => (
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
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
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
              otp.every(digit => digit !== '') && styles.verifyButtonActive
            ]} 
            onPress={handleVerify}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton} 
            onPress={handleResend}
          >
            <Text style={[
              styles.resendText,
              timeLeft > 0 && styles.resendTextDisabled
            ]}>
              Resend code in {formatTime(timeLeft)}
            </Text>
          </TouchableOpacity>
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
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    color: '#06053A',
    fontSize: 14,
  },
  resendTextDisabled: {
    opacity: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default OTPVerificationScreen; 