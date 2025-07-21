import * as Keychain from 'react-native-keychain';

export const getAuthToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    return credentials.password;
  }
  return null;
}; 