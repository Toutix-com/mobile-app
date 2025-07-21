import { Alert } from 'react-native';
import { updateUserProfile } from '../../../services/ApiService';
import { updateUser, setUser, userStore } from '../../login/store/login.store';
import { RegisterFormFields } from '../../login/enums/auth-enum';
import { signal } from '@preact/signals-react';

export const showDatePicker = signal<boolean>(false);
export const setShowDatePicker = (val: boolean) => { showDatePicker.value = val; };

export const handleInputChange = (field: string, value: string | Date | undefined) => {
  let finalValue = value;
  if (field === RegisterFormFields.BIRTHDAY && value && !(value instanceof Date)) {
    try {
      finalValue = new Date(value as string);
    } catch (e) {}
  }
  updateUser({ [field]: finalValue });
};

export const handleSubmit = async (navigation: any) => {
  try {
    const dateOfBirth = userStore.value.birthday
      ? userStore.value.birthday.toISOString().split('T')[0]
      : undefined;
    const [data, error] = await updateUserProfile({
      firstName: userStore.value.firstName || '',
      lastName: userStore.value.lastName || '',
      dateOfBirth,
    });
    if (error) {
      Alert.alert('Error', 'Failed to update profile');
      return;
    }
    setUser({
      ...userStore.value,
      id: (data as any).id,
      firstName: (data as any).firstName,
      lastName: (data as any).lastName,
      email: (data as any).email,
      contactNumber: (data as any).contactNumber,
      address: (data as any).address,
      birthday: (data as any).dateOfBirth,
      role: (data as any).role,
      isNewUser: (data as any).isNewUser,
      image: (data as any).image,
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (e) {
    Alert.alert('Error', 'Failed to update profile');
  }
}; 