import { signal } from '@preact/signals-react';
import { Alert } from 'react-native';
import GoogleSignInService from '../../../services/GoogleSignInService';
import AppleSignInService from '../../../services/AppleSignInService';
import { loginWithOtp, loginWithGoogle, loginWithApple, getUserProfile } from '../../../services/ApiService';
import { LoginType } from '../enums/auth-enum';
import * as Keychain from 'react-native-keychain';
import { getAuthToken } from '../../../utils/authToken';
import { showSuccessToast, showErrorToast } from '../../../components/toast';

export interface UserState {
    id?: string;
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    isNewUser?: boolean;
    isAuthenticated?: boolean;
    role?: string;
    contactNumber?: string;
    address?: string | null;
    birthday?: Date;
    image?: string | null;
    isLoading?: boolean;
    otp?: string[];
    timer?: any;
    dateOfBirth?: string;
}

export const dateOfBirth = signal<Date>(new Date(2000, 0, 1));
export const userStore = signal<UserState>({
    birthday: new Date(2000, 0, 1),
    isAuthenticated: true
});

export const showSplash = signal<boolean>(true);
export const showAuthStack = signal<boolean>(false);


export const setUser = (user: UserState) => {
    userStore.value = {
        ...userStore.value,
        ...user,
    }
};

export const logout = async () => {
    try {
        // Clear the keychain
        await Keychain.resetGenericPassword();
    } catch (error) {
    }
    
    userStore.value = {
        birthday: new Date(2000, 0, 1),
        isAuthenticated: false,
        firstName: '',
        lastName: '',
    };
};

export const updateUser = (fields: Partial<UserState>) => {
    userStore.value = {
        ...userStore.value,
        ...fields,
    }
};

export const fetchUserProfile = async () => {
    try {
        const [profileData, error] = await getUserProfile();
        if (error) {
            return false;
        }
        
        if (profileData) {
            // Type the profileData as UserProfile
            const profile = profileData as UserState;
            
            // Update userStore with the fetched profile data
            setUser({
                ...userStore.value,
                id: profile.id,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                contactNumber: profile.contactNumber,
                role: profile.role,
                address: profile.address,
                birthday: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
                image: profile.image,
                isAuthenticated: true,
            });
            return true;
        }
        
        return false;
    } catch (error) {
        return false;
    }
};

export const validateInput = (value: string) => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\+\d{10,15}$/;
  
    if (emailRegex.test(value)) {
      return { type: LoginType.EMAIL, value };
    }
  
    if (phoneRegex.test(value)) {
      return { type: LoginType.MOBILE, value };
    }
  
    return null;
  };

export const handleGoogleSignIn = async (navigation: any) => {
    setUser({ ...userStore.value, isLoading: true });
    try {
        const result = await GoogleSignInService.signIn();
        
        if (result && result.idToken) {
            const response: any = await loginWithGoogle(result.idToken);
            const [firstName, lastName] = result?.name?.split(' ') || '';
            const [data, error] = response;
            if (!error) {
                setUser({
                    ...userStore.value,
                    email: result.email,
                    firstName,
                    lastName,
                    isAuthenticated: true,
                    isNewUser: data.isNewUser,
                    role: data.role,
                });
                await Keychain.setGenericPassword('auth', data.token);
                setShowAuthStack(false); // Hide auth stack and return to app stack
                showSuccessToast('Successfully signed in with Google!');
            } else {
                const errorMessage = (response as any)?.message || 'Failed to login with Google';
                showErrorToast(errorMessage);
            }
        } else {
            showErrorToast('Failed to sign in with Google');
        }
    } catch (error) {
        showErrorToast('Failed to sign in with Google');
    } finally {
        setUser({ ...userStore.value, isLoading: false });
    }
};

export const handleAppleSignIn = async (navigation: any) => {
    setUser({ ...userStore.value, isLoading: true });
    try {
        const result = await AppleSignInService.onAppleButtonPress();
        
        if (result.success && result.data) {
            const [data, error] = result.data;
            if (!error) {
                setUser({
                    ...userStore.value,
                    email: result.email || data.email,
                    firstName: result.fullName?.givenName || data.firstName,
                    lastName: result.fullName?.familyName || data.lastName,
                    isAuthenticated: true,
                    isNewUser: data.isNewUser,
                    role: data.role,
                });
                await Keychain.setGenericPassword('auth', data.token);
                setShowAuthStack(false); // Hide auth stack and return to app stack
                showSuccessToast('Successfully signed in with Apple!');
            } else {
                const errorMessage = (result.data as any)?.message || 'Failed to login with Apple';
                showErrorToast(errorMessage);
            }
        } else {
            showErrorToast(result.error || 'Failed to sign in with Apple');
        }
    } catch (error) {
        showErrorToast('Failed to sign in with Apple');
    } finally {
        setUser({ ...userStore.value, isLoading: false });
    }
};

export const handleContinue = async (navigation: any) => {
    const input = userStore.value.email;
    if (!input) {
        Alert.alert('Error', 'Please enter your email or mobile number');
        return;
    }
    const valid = validateInput(input.trim());
    if (!valid) {
        Alert.alert('Error', 'Please enter a valid email or mobile number');
        return;
    }
    setUser({ ...userStore.value, isLoading: true, email: input });
    try {
        const response = valid.type === LoginType.EMAIL
            ? (
                setUser({ ...userStore.value, email: valid.value, phoneNumber: undefined }),
                await loginWithOtp({ email: valid.value })
            )
            : (
                setUser({ ...userStore.value, phoneNumber: valid.value, email: undefined }),
                await loginWithOtp({ phoneNumber: valid.value })
            );


        const [data, error] = response;
        if (!error) {
            navigation.navigate('OTPVerification', {
                email: valid.type === LoginType.EMAIL ? valid.value : null,
                phoneNumber: valid.type === LoginType.MOBILE ? valid.value : null,
                type: valid.type === LoginType.EMAIL ? LoginType.EMAIL : LoginType.MOBILE,
            });
        } else {
            Alert.alert('Error', error?.message || 'Failed to send OTP');
        }
    } catch (e) {
        Alert.alert('Error', 'Failed to send OTP');
    } finally {
        setUser({ ...userStore.value, isLoading: false });
    }
};

export const setShowSplash = (value: boolean) => {
    showSplash.value = value;
};

export const setShowAuthStack = (value: boolean) => {
    showAuthStack.value = value;
};

// Function to restore authentication state on app startup
export const restoreAuthState = async (): Promise<boolean> => {
    try {
        const token = await getAuthToken();
        if (token) {
            // Token exists, try to get user profile to verify it's still valid
            const [userData, error] = await getUserProfile();
            if (!error && userData) {
                // Token is valid, restore user state
                setUser({
                    ...userStore.value,
                    ...userData,
                    isAuthenticated: true,
                });
                return true;
            } else {
                // Token is invalid, clear it
                await Keychain.resetGenericPassword();
                setUser({
                    ...userStore.value,
                    isAuthenticated: false,
                });
                return false;
            }
        } else {
            // No token found
            setUser({
                ...userStore.value,
                isAuthenticated: false,
            });
            return false;
        }
    } catch (error) {
        showErrorToast('Failed to restore auth state');
        // On error, assume not authenticated
        setUser({
            ...userStore.value,
            isAuthenticated: false,
        });
        return false;
    }
};