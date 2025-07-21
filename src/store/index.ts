import { signal, computed, effect } from '@preact/signals-react';

// Define your store types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  theme: 'light' | 'dark';
  loading: boolean;
}

// Initialize store with default values
export const appState = signal<AppState>({
  isAuthenticated: false,
  user: null,
  theme: 'light',
  loading: false
});

// Create computed values
export const isAuthenticated = computed(() => appState.value.isAuthenticated);
export const currentUser = computed(() => appState.value.user);
export const currentTheme = computed(() => appState.value.theme);
export const isLoading = computed(() => appState.value.loading);

// Debug effect to log state changes
effect(() => {
  // console.log('Store State Updated:', {
  //   theme: appState.value.theme,
  //   isAuthenticated: appState.value.isAuthenticated,
  //   hasUser: !!appState.value.user,
  //   loading: appState.value.loading
  // });
});

// Store actions
export const storeActions = {
  setUser: (user: User | null) => {
    appState.value = {
      ...appState.value,
      user,
      isAuthenticated: !!user,
    };
  },

  logout: () => {
    appState.value = {
      ...appState.value,
      user: null,
      isAuthenticated: false,
    };
  },

  toggleTheme: () => {
    const newTheme = appState.value.theme === 'light' ? 'dark' : 'light';
    // console.log('Toggling theme to:', newTheme);
    
    // Update the entire state object
    appState.value = {
      ...appState.value,
      theme: newTheme,
    };
  },

  setLoading: (loading: boolean) => {
    appState.value = {
      ...appState.value,
      loading,
    };
  },
}; 