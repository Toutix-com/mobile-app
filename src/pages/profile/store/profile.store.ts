import { signal } from '@preact/signals-react';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { userStore, setUser, fetchUserProfile } from '../../login/store/login.store';
import { updateUserProfile } from '../../../services/ApiService';

// ProfileScreen signals and interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  dob: string; // display format e.g. 01.01.1990
  addressLine1: string;
  addressLine2?: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'generic';

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  nickname: string;
}

export interface TicketHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  price: string; // e.g. $150.50
  image: string;
}

// ProfileScreen signals
export const profile = signal<UserProfile>({
  id: '',
  name: '',
  email: '',
  avatar: '',
  phone: '',
  dob: '',
  addressLine1: '',
  addressLine2: '',
});

export const emailNotifications = signal<boolean>(true);
export const appNotifications = signal<boolean>(true);

export const paymentMethods = signal<PaymentMethod[]>([
  { id: 'pm_1', brand: 'mastercard', last4: '7890', nickname: 'Card nickname' },
  { id: 'pm_2', brand: 'visa', last4: '7890', nickname: 'Card nickname' },
]);

export const ticketHistory = signal<TicketHistoryItem[]>([
  {
    id: 't_1',
    title: 'Night Pulse: An Immersive...',
    subtitle: 'General entry ticket',
    price: '$10.00',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't_2',
    title: 'Summer Beats: A Vibran...',
    subtitle: 'Standard admission pass',
    price: '$150.50',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't_3',
    title: 'Ocean Vibes',
    subtitle: 'General admission ticket',
    price: '$150.50',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop',
  },
]);

// ProfileScreen setters / actions
export const setEmailNotifications = (value: boolean) => {
  emailNotifications.value = value;
};

export const setAppNotifications = (value: boolean) => {
  appNotifications.value = value;
};

export const addPaymentMethod = (method: PaymentMethod) => {
  paymentMethods.value = [method, ...paymentMethods.value];
};

export const removePaymentMethod = (id: string) => {
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== id);
};

export const updateProfile = (updates: Partial<UserProfile>) => {
  profile.value = { ...profile.value, ...updates };
};

export const logout = () => {
  // TODO: wire with auth module
  console.log('Logging out...');
};

// EditProfileScreen signals
export const profileFormData = signal({
  firstName: userStore.value.firstName || '',
  lastName: userStore.value.lastName || '',
  contactNumber: userStore.value.contactNumber || '',
  address: userStore.value.address || '',
  birthday: userStore.value.birthday,
});

// UI state signals
export const showDatePicker = signal(false);
export const isLoading = signal(false);
export const error = signal<string | null>(null);
export const isImageLoading = signal(false);
export const permissions = signal({ camera: false, storage: false });

// Image state signals
export const selectedImage = signal<{
  uri: string;
  type: string;
  name: string;
} | null>(null);
export const showImageRemoved = signal(false);

// Helper functions to update signal values
export const setProfileFormData = (updates: Partial<typeof profileFormData.value>) => {
  profileFormData.value = { ...profileFormData.value, ...updates };
};

export const setPermissions = (newPermissions: { camera: boolean; storage: boolean }) => {
  permissions.value = newPermissions;
};

// Initialize form data from userStore
export const initializeFormData = () => {
  setProfileFormData({
    firstName: userStore.value.firstName || '',
    lastName: userStore.value.lastName || '',
    contactNumber: userStore.value.contactNumber || '',
    address: userStore.value.address || '',
    birthday: userStore.value.birthday,
  });
};

// Check permissions function
export const checkPermissions = async () => {
  if (Platform.OS === 'android') {
    const cameraGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    
    // For Android 13+ (API 33+), use READ_MEDIA_IMAGES instead of READ_EXTERNAL_STORAGE
    let storageGranted = false;
    if (Number(Platform.Version) >= 33) {
      try {
        storageGranted = await PermissionsAndroid.check('android.permission.READ_MEDIA_IMAGES');
      } catch (error) {
        // Fallback to READ_EXTERNAL_STORAGE for older devices
        storageGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }
    } else {
      storageGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
    
    return { camera: cameraGranted, storage: storageGranted };
  }
  return { camera: true, storage: true }; // iOS handles permissions differently
};

// Open app settings function
export const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

// Handle permission denied function
export const handlePermissionDenied = (permissionType: string) => {
  Alert.alert(
    'Permission Required',
    `${permissionType} permission is required to ${permissionType === 'Camera' ? 'take a photo' : 'select a photo'}.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Continue Without Photo', 
        onPress: () => {
          Alert.alert(
            'Profile Update',
            'You can still update your profile information without changing the photo. The photo will remain unchanged.',
            [{ text: 'OK' }]
          );
        },
        style: 'default'
      },
      { 
        text: 'Open Settings', 
        onPress: openAppSettings,
        style: 'default'
      },
    ]
  );
};

// Test permissions function
export const testPermissions = async () => {
  try {
    const result = await checkPermissions();
    console.log('Current permissions:', result);
    
    if (Platform.OS === 'android') {
      const cameraStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      
      // Check storage permission based on Android version
      let storageStatus = false;
      if (Number(Platform.Version) >= 33) {
        try {
          storageStatus = await PermissionsAndroid.check('android.permission.READ_MEDIA_IMAGES');
        } catch (error) {
          storageStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
      } else {
        storageStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }
      
      console.log('Camera permission:', cameraStatus);
      console.log('Storage permission:', storageStatus);
      console.log('Android version:', Platform.Version);
      
      Alert.alert(
        'Permission Status',
        `Camera: ${cameraStatus ? 'Granted' : 'Denied'}\nStorage: ${storageStatus ? 'Granted' : 'Denied'}\nAndroid API: ${Platform.Version}`,
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Permission test error:', error);
  }
};

// Image validation function
export const validateAndSetImage = (asset: Asset) => {
  if (!asset.uri) {
    Alert.alert('Error', 'Invalid image file. Please try again.');
    return false;
  }

  // Check file size (limit to 5MB)
  if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
    Alert.alert('Error', 'Image file is too large. Please select an image smaller than 5MB.');
    return false;
  }

  // Check file type
  if (asset.type && !asset.type.startsWith('image/')) {
    Alert.alert('Error', 'Please select a valid image file.');
    return false;
  }

  return true;
};

// Open camera function
export const openCamera = async () => {
  isImageLoading.value = true;
  try {
    // Request camera permission for Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take a profile picture.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        handlePermissionDenied('Camera');
        return;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Blocked',
          'Camera permission has been permanently denied. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openAppSettings },
          ]
        );
        return;
      }
    }

    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: false,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', `Camera error: ${result.errorMessage}`);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (validateAndSetImage(asset)) {
        const imageData = {
          uri: asset.uri!,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'camera_photo.jpg',
        };
        selectedImage.value = imageData;
        showImageRemoved.value = false;
      }
    }
  } catch (error) {
    console.error('Camera error:', error);
    Alert.alert('Error', 'Failed to open camera. Please try again.');
  } finally {
    isImageLoading.value = false;
  }
};

// Open photo library function
export const openPhotoLibrary = async () => {
  isImageLoading.value = true;
  try {
    // Request storage permission for Android
    if (Platform.OS === 'android') {
      let permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      let permissionTitle = 'Storage Permission';
      let permissionMessage = 'This app needs access to your photo library to select a profile picture.';
      
      // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
      if (Number(Platform.Version) >= 33) {
        permission = 'android.permission.READ_MEDIA_IMAGES' as any;
        permissionTitle = 'Media Permission';
        permissionMessage = 'This app needs access to your photos to select a profile picture.';
      }
      
      const granted = await PermissionsAndroid.request(
        permission,
        {
          title: permissionTitle,
          message: permissionMessage,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        handlePermissionDenied('Storage');
        return;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Blocked',
          'Storage permission has been permanently denied. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openAppSettings },
          ]
        );
        return;
      }
    }

    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 1,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', `Photo library error: ${result.errorMessage}`);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (validateAndSetImage(asset)) {
        const imageData = {
          uri: asset.uri!,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'gallery_photo.jpg',
        };
        selectedImage.value = imageData;
        showImageRemoved.value = false;
      }
    }
  } catch (error) {
    console.error('Photo library error:', error);
    Alert.alert('Error', 'Failed to open photo library. Please try again.');
  } finally {
    isImageLoading.value = false;
  }
};

// Handle image selection
export const handleSelectImage = () => {
  Alert.alert(
    'Select Image',
    'Choose an option',
    [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Photo Library',
        onPress: () => openPhotoLibrary(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]
  );
};

// Handle remove picture
export const handleRemovePicture = () => {
  // Show image removed state (will be applied when saving)
  showImageRemoved.value = true;
  selectedImage.value = null;
};

// Handle date change
export const handleDateChange = (event: any, selectedDate?: Date) => {
  showDatePicker.value = false;
  if (selectedDate) {
    setProfileFormData({ birthday: selectedDate });
  }
};

// Handle save changes
export const handleSaveChanges = async (navigation: any) => {
  isLoading.value = true;
  error.value = null;
  try {
    // Prepare the data for API
    const updateData = {
      firstName: profileFormData.value.firstName,
      lastName: profileFormData.value.lastName,
      contactNumber: profileFormData.value.contactNumber,
      address: profileFormData.value.address,
      dateOfBirth: profileFormData.value.birthday ? profileFormData.value.birthday.toISOString().split('T')[0] : undefined,
      imageFile: selectedImage.value || undefined,
    };

    const response= await updateUserProfile(updateData);


    if (response) {
      setUser({
        ...userStore.value,
        firstName: profileFormData.value.firstName,
        lastName: profileFormData.value.lastName,
        contactNumber: profileFormData.value.contactNumber,
        address: profileFormData.value.address,
        birthday: profileFormData.value.birthday,
        image: showImageRemoved.value ? null : (selectedImage.value ? selectedImage.value.uri : userStore.value.image),
      });
      error.value = null;
      navigation.goBack();
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Reset all signals to initial state
export const resetProfileSignals = () => {
  showDatePicker.value = false;
  isLoading.value = false;
  error.value = null;
  isImageLoading.value = false;
  selectedImage.value = null;
  showImageRemoved.value = false;
  initializeFormData();
};

// ProfileScreen specific signals
export const isLoadingProfile = signal(false);
export const profileError = signal<string | null>(null);

// ProfileScreen functions
export const fetchUserProfileData = async () => {
  isLoadingProfile.value = true;
  profileError.value = null;
  
  try {
    const success = await fetchUserProfile();
    if (!success) {
      profileError.value = 'Failed to load profile data';
    }
  } catch (error) {
    profileError.value = 'Error loading profile data';
    console.error('Profile fetch error:', error);
  } finally {
    isLoadingProfile.value = false;
  }
};

export const handleLoginPress = () => {
  // Set user as not authenticated to trigger switch to AuthStack
  setUser({ 
    ...userStore.value,
    isAuthenticated: false
  });
};

export const handleLogout = async () => {
  try {
    // Clear user authentication state
    setUser({
      birthday: new Date(2000, 0, 1),
      isAuthenticated: false
    });
    
    // This will automatically switch to AuthStack (not authenticated state)
  } catch (error) {
    console.error('Logout error:', error);
  }
}; 