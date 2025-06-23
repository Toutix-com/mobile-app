import {
  GoogleSignin,
  statusCodes,
  type User,
} from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env';

export interface GoogleSignInResult {
  email: string;
  name: string | null;
  photo: string | null;
  idToken: string | null;
}

class GoogleSignInService {
  static init() {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  static async signIn(): Promise<GoogleSignInResult | null> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("sasasasa", userInfo);
      
      const userData = userInfo?.data;
      
      return userInfo ? {
        email: userData.user?.email,
        name: userData.user?.name,
        photo: userData.user?.photo,
        idToken: userData.idToken,
      } : null;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
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
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Error checking sign in status:', error);
      return false;
    }
  }
}

export default GoogleSignInService; 