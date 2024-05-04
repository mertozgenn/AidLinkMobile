import React from 'react';
import MainRouter from './src/MainRouter';
import {StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/ToastHelper';

function App() {
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'}></StatusBar>
      <MainRouter></MainRouter>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
