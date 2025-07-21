import { useComputed, useSignalEffect } from '@preact/signals-react';
import { appState, storeActions } from './index';

export const useAppStore = () => {
  const isAuthenticated = useComputed(() => appState.value.isAuthenticated);
  const currentUser = useComputed(() => appState.value.user);
  const theme = useComputed(() => appState.value.theme);
  const loading = useComputed(() => appState.value.loading);

  return {
    // State
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
    theme: theme.value,
    loading: loading.value,
    
    // Actions
    ...storeActions
  };
}; 