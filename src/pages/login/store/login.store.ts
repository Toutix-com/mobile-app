import { signal } from '@preact/signals-react';
import { Alert } from 'react-native';
import GoogleSignInService from '../../../services/GoogleSignInService';
import { loginWithOtp, loginWithGoogle, getUserProfile } from '../../../services/ApiService';
import { LoginType } from '../enums/auth-enum';
import * as Keychain from 'react-native-keychain';

export interface UserState {
    id?: string;
    email?: string;
    mobileNumber?: string;
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


export const setUser = (user: UserState) => {
    userStore.value = {
        ...userStore.value,
        ...user,
    }
};

export const logout = () => {
    userStore.value = {
        birthday: new Date(2000, 0, 1),
        isAuthenticated: false,
        firstName: '',
        lastName: '',
    };
    Keychain.resetGenericPassword();
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
        console.log("profileData", profileData);
        if (error) {
            console.error('Error fetching user profile:', error);
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
        console.error('Error in fetchUserProfile:', error);
        return false;
    }
};

export const validateInput = (value: string) => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
    if (emailRegex.test(value)) return { type: LoginType.EMAIL, value };
    if (phoneRegex.test(value)) return { type: LoginType.MOBILE, value };
    return null;
};

export const handleGoogleSignIn = async (navigation: any) => {
    setUser({ ...userStore.value, isLoading: true });
    try {
        const result = await GoogleSignInService.signIn();
        console.log("result", result);
        
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
            } else {
                Alert.alert('Error', (response as any)?.message ? (response as any).message : 'Failed to login with Google');
            }
        } else {
            Alert.alert('Error', 'Failed to sign in with Google');
        }
    } catch (error) {
        Alert.alert('Error', 'Failed to sign in with Google');
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
    setUser({ ...userStore.value, isLoading: true });
    try {
        const response = valid.type === LoginType.EMAIL
            ? (
                setUser({ ...userStore.value, email: valid.value, mobileNumber: undefined }),
                await loginWithOtp({ email: valid.value })
            )
            : (
                setUser({ ...userStore.value, mobileNumber: valid.value, email: undefined }),
                await loginWithOtp({ mobileNumber: valid.value })
            );


        const [data, error] = response;
        if (!error) {
            navigation.navigate('OTPVerification', {
                email: valid.type === LoginType.EMAIL ? valid.value : 'test@gmail.com',
                mobileNumber: valid.type === LoginType.MOBILE ? valid.value : undefined,
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