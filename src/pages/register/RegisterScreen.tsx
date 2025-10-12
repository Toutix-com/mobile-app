import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import BlurredCirclesBackground from '../../components/layouts/BlurredCirclesBackground';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DatePicker from 'react-native-date-picker';
import { Calendar, ChevronLeft } from 'lucide-react-native';
import { rootStore } from '../../store/rootStore';
import { useComputed } from '@preact/signals-react';
import moment from 'moment';
import { handleInputChange, handleSubmit, showDatePicker, setShowDatePicker } from './store/register.store';
import { RegisterFormFields } from '../login/enums/auth-enum';
import { useSignals } from '@preact/signals-react/runtime';
import { tokens, normalize } from '../../design-system';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  useSignals()
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useComputed(() => rootStore.value.user);


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '912281763788-9vfavok5rl5pmhca64e9jcek89g44ik0.apps.googleusercontent.com',
    });
  }, []);

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <BlurredCirclesBackground>
      <TouchableOpacity style={styles.backButton} onPress={handleLoginPress}>
        <ChevronLeft color={tokens.colors.textInverse} size={24} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logos/toutix_logo_full.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Find It, Book It, Live It</Text>
          </View>



          <View style={styles.formContainer}>
            <Text style={styles.title}>Register with Toutix</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={tokens.colors.textSecondary}
                value={user.value.firstName}
                onChangeText={(value) => handleInputChange(RegisterFormFields.FIRST_NAME, value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor={tokens.colors.textSecondary}
                value={user.value.lastName}
                onChangeText={(value) => handleInputChange(RegisterFormFields.LAST_NAME, value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthday (Optional)</Text>
              <Pressable
                style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ flex: 1, color: user.value.birthday ? tokens.colors.text : tokens.colors.textSecondary }}>
                  {user.value.birthday
                    ? moment(user.value.birthday).format('DD/MM/YYYY')
                    : 'Select your date of birth'}
                </Text>
                <Calendar color={tokens.colors.textSecondary} size={20} />
              </Pressable>
              <DatePicker
                modal
                open={showDatePicker.value}
                date={user.value.birthday instanceof Date ? user.value.birthday : new Date(2000, 0, 1)}
                onCancel={() => setShowDatePicker(false)}
                onConfirm={(date) => {
                  setShowDatePicker(false);
                  if (date) handleInputChange(RegisterFormFields.BIRTHDAY, date);
                }}
                mode="date"
                maximumDate={new Date()}
              />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={() => handleSubmit(navigation)}>
              <Text style={styles.registerButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BlurredCirclesBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normalize(50) : normalize(20),
    left: normalize(20),
    width: normalize(40),
    height: normalize(40),
    borderRadius: tokens.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: tokens.colors.textInverse,
    fontSize: normalize(tokens.typography.fontSize.lg),
    fontWeight: tokens.typography.fontWeight.normal,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(120) : normalize(90),
    paddingHorizontal: normalize(20),
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
    marginTop: normalize(24),
    textAlign: 'center',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(24),
  },
  loginText: {
    color: tokens.colors.textInverse,
    fontSize: normalize(tokens.typography.fontSize.base),
  },
  loginLink: {
    color: tokens.colors.textInverse,
    fontSize: normalize(tokens.typography.fontSize.base),
    textDecorationLine: 'underline',
  },
  formContainer: {
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: normalize(24),
    borderTopRightRadius: normalize(24),
    padding: normalize(24),
    marginTop: "20%",
    flex: 1
  },
  title: {
    fontSize: normalize(tokens.typography.fontSize['2xl']),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text,
    marginBottom: normalize(24),
  },
  inputContainer: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(tokens.typography.fontSize.base),
    color: tokens.colors.text,
    marginBottom: normalize(8),
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.default,
    padding: normalize(16),
    fontSize: normalize(tokens.typography.fontSize.base),
  },
  registerButton: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.borderRadius.full,
    padding: normalize(16),
    alignItems: 'center',
    marginTop: normalize(8),
  },
  registerButtonText: {
    color: tokens.colors.textInverse,
    fontSize: normalize(tokens.typography.fontSize.base),
    fontWeight: tokens.typography.fontWeight.bold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(24),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.colors.border,
  },
  dividerText: {
    color: tokens.colors.textSecondary,
    paddingHorizontal: normalize(16),
    fontSize: normalize(tokens.typography.fontSize.sm),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? normalize(34) : normalize(24),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadius.default,
    padding: normalize(16),
    borderColor: tokens.colors.primary,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: normalize(3),
  },
  socialButtonText: {
    fontSize: normalize(tokens.typography.fontSize.base),
    color: tokens.colors.text,
    fontWeight: tokens.typography.fontWeight.medium,
    marginLeft: normalize(12),
  },
});

export default RegisterScreen; 