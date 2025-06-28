import React, { useState, useEffect } from 'react';
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
  Alert,
  Pressable,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import GradientLayout from '../components/layouts/GradientLayout';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DatePicker from 'react-native-date-picker';
import { Calendar, ChevronLeft } from 'lucide-react-native';
import { updateUserProfile } from '../services/ApiService';
import { rootStore, updateUser, setUser, userStore } from '../store/rootStore';
import { useSignal, useComputed } from '@preact/signals-react';
import moment from 'moment';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  useSignal()
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useComputed(() => rootStore.value.user);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: Date.now(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const store = rootStore.value


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '912281763788-9vfavok5rl5pmhca64e9jcek89g44ik0.apps.googleusercontent.com',
    });
  }, []);

  const handleInputChange = (field: string, value: string | Date | undefined) => {
  let finalValue = value;

  if (field === 'birthday' && value && !(value instanceof Date)) {
    try {
      finalValue = new Date(value as string);
    } catch (e) {
    }
  }
  updateUser({ [field]: finalValue });
};

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSubmit = async () => {
    try {
      const dateOfBirth = userStore.value.birthday
        ? userStore.value.birthday.toISOString().split('T')[0]
        : undefined;
      const response = await updateUserProfile({
        firstName: userStore.value.firstName || '',
        lastName: userStore.value.lastName || '',
        dateOfBirth,
      });

      setUser({
        ...rootStore.value.user,
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        contactNumber: response.contactNumber,
        address: response.address,
        birthday: response.dateOfBirth,
        role: response.role,
        isNewUser: response.isNewUser,
        image: response.image,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      // TODO: Navigate to the next screen (e.g., home)
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <GradientLayout>
      <TouchableOpacity style={styles.backButton} onPress={handleLoginPress}>
        <ChevronLeft color="#FFFFFF" size={24} />
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
              source={require('../assets/logos/toutix_logo_full.png')}
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
                placeholderTextColor="#A0A0A0"
                value={user.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#A0A0A0"
                value={user.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthday (Optional)</Text>
              <Pressable
                style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ flex: 1, color: formData.birthday ? '#000' : '#A0A0A0' }}>
                  {userStore.value.birthday
                    ? moment(userStore.value.birthday).format('DD/MM/YYYY')
                    : 'Select your date of birth'}
                </Text>
                <Calendar color="#A0A0A0" size={20} />
              </Pressable>
              <DatePicker
                modal
                open={showDatePicker}
                date={userStore.value.birthday instanceof Date ? userStore.value.birthday : new Date(2000, 0, 1)}
                onCancel={() => setShowDatePicker(false)}
                onConfirm={(date) => {
                  setShowDatePicker(false);
                  if (date) handleInputChange('birthday', date);
                }}
                mode="date"
                maximumDate={new Date()}
              />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
              <Text style={styles.registerButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientLayout>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '300',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 120 : 90,
    paddingHorizontal: 20,
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
    marginTop: 24,
    textAlign: 'center',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginLink: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: "20%",
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
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
  },
  registerButton: {
    backgroundColor: '#0C0453',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    color: '#666666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 16,
    borderColor: '#0C0453',
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 3,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default RegisterScreen; 