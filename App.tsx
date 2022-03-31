import React from 'react';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContextProvider, useAuth } from './src/hooks/useAuth';

import { Routes } from './src/routes'

import theme from './src/global/styles/theme'

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })
  const { userStorageLoading } = useAuth()

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <AuthContextProvider>
          <Routes />
        </AuthContextProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default App