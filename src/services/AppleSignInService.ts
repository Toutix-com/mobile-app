import { appleAuth } from '@invertase/react-native-apple-authentication';
import { loginWithApple } from './ApiService';
import { showErrorToast } from '@components/toast';

// Simple base64 decoder for React Native
function base64Decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  
  str = str.replace(/[^A-Za-z0-9+/]/g, '');
  
  while (i < str.length) {
    const encoded1 = chars.indexOf(str.charAt(i++));
    const encoded2 = chars.indexOf(str.charAt(i++));
    const encoded3 = chars.indexOf(str.charAt(i++));
    const encoded4 = chars.indexOf(str.charAt(i++));
    
    const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
    
    result += String.fromCharCode((bitmap >> 16) & 255);
    if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
    if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
  }
  
  return result;
}

export interface AppleSignInResult {
  success: boolean;
  data?: any;
  error?: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
}

async function onAppleButtonPress(): Promise<AppleSignInResult> {
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!response.identityToken) {
      throw new Error('No identity token received from Apple');
    }

    
    // Extract email from JWT token if not provided directly
    let userEmail = response.email;
    if (!userEmail && response.identityToken) {
      try {
        // Decode JWT token to extract email
        const tokenParts = response.identityToken.split('.');
        const base64Payload = tokenParts[1];
        // Add padding if needed
        const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4);
        const decodedPayload = base64Decode(paddedPayload);
        const payload = JSON.parse(decodedPayload);
        userEmail = payload.email;
      } catch (error) {
        showErrorToast('Failed to sign in with Apple');
      }
    }

    // Send identityToken to your backend for authentication
    const result = await loginWithApple(response.identityToken);
    
    return {
      success: true,
      data: result,
      email: userEmail || undefined,
      fullName: {
        givenName: response.fullName?.givenName || undefined,
        familyName: response.fullName?.familyName || undefined
      }
    };

  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Apple sign in failed'
    };
  }
}

export default {
  onAppleButtonPress
}