import { Alert } from 'react-native';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { setUser, userStore } from '../../login/store/login.store';
import { verifyOtp, loginWithOtp } from '../../../services/ApiService';
import * as Keychain from 'react-native-keychain';
import { signal } from '@preact/signals-react';

export const timeLeft = signal<number>(45);
export const setTimeLeft = (n: number) => { timeLeft.value = n; };

export const handleOtpChange = (value: string, index: number, inputRefs: Array<any>) => {
  const newOtp = [...(userStore.value.otp || [])];
  if (value.length > 1) {
    const digits = value.split('').slice(0, 6);
    digits.forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });
    const nextIndex = Math.min(index + digits.length, 5);
    inputRefs[nextIndex]?.focus();
  } else {
    newOtp[index] = value;
    if (value === '' && index > 0) {
      inputRefs[index - 1]?.focus();
    } else if (value !== '' && index < 5) {
      inputRefs[index + 1]?.focus();
    }
  }
  setUser({
    ...userStore.value,
    otp: newOtp,
  });
};

export const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number, inputRefs: Array<any>) => {
  if (event.nativeEvent.key === 'Backspace' && userStore.value.otp?.[index] === '' && index > 0) {
    inputRefs[index - 1]?.focus();
  }
};

export const handleVerify = async (route: any, navigation: any) => {
  const otpString = userStore.value.otp?.join('') || '';
  try {
    const [data, error] = await verifyOtp({ email: route.params.email || '', otp: otpString });
    if (error) {
      Alert.alert('Error', (error).response?.data?.message || 'Invalid OTP');
      return;
    }
    if (data) {
      setUser({
        ...userStore.value,
        isNewUser: data.isNewUser,
        role: data.role,
        isAuthenticated: true,
      });
      console.log("data", data);
      
      await Keychain.setGenericPassword('auth', data.token);
      if (data.isNewUser) {
        navigation.navigate('Register');
      }
    }
  } catch (e) {
    Alert.alert('Error', 'Failed to verify OTP');
  }
};

export const handleResend = async (route: any, setTimeLeft: (n: number) => void, timeLeft: number) => {
  if (!!timeLeft.value) {
    try {
      const payload = route.params.email ? { email: route.params.email } : { mobileNumber: route.params.mobileNumber };
      const [, error] = await loginWithOtp(payload);
      if (error) {
        Alert.alert('Error', (error as any).response?.data?.message || 'Failed to resend OTP');
        return;
      }
      setTimeLeft(45);
      Alert.alert('Success', 'OTP resent successfully');
    } catch (e) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  }
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
