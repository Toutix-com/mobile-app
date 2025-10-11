import {
  GoogleSignin,
  statusCodes,
  type User,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

// Client IDs from google-services.json
const WEB_CLIENT_ID = '1020926589370-ljjvvn2psb3j4sb197h3f9ceenmcler1.apps.googleusercontent.com';
const IOS_CLIENT_ID = '1020926589370-9u0at2bffebn7kfn3p09khq9oh6jfdhg.apps.googleusercontent.com';

export interface GoogleSignInResult {
  email: string;
  name: string | null;
  photo: string | null;
  idToken: string | null;
}

class GoogleSignInService {
  static init() {
    try {
      const config: any = {
        webClientId: WEB_CLIENT_ID,
        iosClientId: Platform.OS === 'ios' ? IOS_CLIENT_ID : undefined,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      };

      GoogleSignin.configure(config);
      console.log('Google Sign-In configured successfully for', Platform.OS);
    } catch (error) {
      console.error('Error configuring Google Sign-In:', error);
    }
  }

  static async signIn(): Promise<GoogleSignInResult | null> {
    try {
      console.log("Starting Google Sign-In process");
      
      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      
      // Sign in
      const userInfo = await GoogleSignin.signIn();
      
      const userData = userInfo?.data;
      
      if (!userData || !userData.user) {
        console.error('No user data received from Google Sign-In');
        return null;
      }
      
      return {
        email: userData.user.email || '',
        name: userData.user.name || null,
        photo: userData.user.photo || null,
        idToken: userData.idToken || null,
      };
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log('Sign in required');
      } else {
        console.log('Some other error happened:', error.toString());
        
      }
      return null;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  static async getCurrentUser(): Promise<GoogleSignInResult | null> {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser ? {
        email: currentUser.user.email,
        name: currentUser.user.name,
        photo: currentUser.user.photo,
        idToken: currentUser.idToken,
      } : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async isSignedIn(): Promise<boolean> {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser !== null;
    } catch (error) {
      console.error('Error checking sign in status:', error);
      return false;
    }
  }
}

export default GoogleSignInService; 
