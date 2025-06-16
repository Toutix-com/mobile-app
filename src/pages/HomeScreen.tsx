import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { rootStore, setUser } from '../store/rootStore';

import { currentTheme } from '../store';

export function HomeScreen(): React.JSX.Element {
  const isDarkMode = currentTheme.value === 'dark';
  const store = rootStore.value

  

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await Keychain.resetGenericPassword();
      setUser({});
    } catch (error) {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/logos/toutix_logo_full.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>
          App initialization is done (Home page)
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
  },
}); 