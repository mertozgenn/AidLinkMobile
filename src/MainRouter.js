import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BackButton from './components/BackButton';

// Screens
import Home from './screens/Home';
import Settings from './screens/Settings';
import Stores from './screens/Stores';
import AccountTransactions from './screens/AccountTransactions';
import QRCode from './screens/QRCode';
import Login from './screens/Login';
import SplashScreen from './screens/SplashScreen';
import QrPaymentSuccessful from './screens/QrPaymentSuccessful';
import QRCollection from './screens/QRCollection';

const MainStack = createNativeStackNavigator();

const header = ({ title, navigation, backButton = true }) => {
  return {
    headerShown: true, headerTitle: title, headerTintColor: "black",
    headerTitleStyle: { fontFamily: 'Poppins-SemiBold', fontSize: 17 }, headerShadowVisible: false,
    headerBackTitleVisible: false, headerBackButtonMenuEnabled: backButton, title: title, headerTitleAlign: 'center',
    headerLeft: () => backButton ? (<BackButton navigation={navigation} />) : (<></>)
  }
}

const HomeStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home"
        component={Home}
        options={{ headerShown: false }} />

      <MainStack.Screen name="Settings"
        component={Settings}
        options={({ navigation }) => (header({ title: 'Ayarlar', navigation: navigation }))} />

      <MainStack.Screen name="AccountTransactions"
        component={AccountTransactions}
        options={({ navigation }) => (header({ title: 'Hesap Hareketleri', navigation: navigation }))} />

      <MainStack.Screen name="Stores"
        component={Stores}
        options={({ navigation }) => (header({ title: 'İşletmeler', navigation: navigation }))} />

    </MainStack.Navigator>
  );
}

const QrCodeStack = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="QRCodeMain" component={QRCode}
        options={({ navigation }) => (header({ title: 'QR Okut', navigation: navigation }))} />
      <MainStack.Screen name="QrPaymentSuccessful" component={QrPaymentSuccessful}
        options={({ navigation }) => (header({ title: 'Ödeme Başarılı', navigation: navigation, backButton: false }))} />
    </MainStack.Navigator>
  );
}

const QrCollectionStack = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="QRCollectionMain" component={QRCollection}
        options={({ navigation }) => (header({ title: 'Ödeme Al', navigation: navigation }))} />
      <MainStack.Screen name="QrPaymentSuccessful" component={QrPaymentSuccessful}
        options={({ navigation }) => (header({ title: 'Ödeme Başarılı', navigation: navigation, backButton: false }))} />
    </MainStack.Navigator>
  );
}

const MainRouter = () => {
  const navigation = React.createRef();
  return (
    <NavigationContainer ref={navigation}>
      <MainStack.Navigator>
        <MainStack.Group>
          <MainStack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="Main" component={HomeStackScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="Login" component={Login} options={{ headerShown: true, headerTitle: "Giriş Yap" }} />
        </MainStack.Group>

        <MainStack.Group screenOptions={{ presentation: 'modal', }}>
          <MainStack.Screen name="QRCode" component={QrCodeStack} options={{ headerShown: false }} />
          <MainStack.Screen name="QRCollection" component={QrCollectionStack} options={{ headerShown: false }} />
        </MainStack.Group>
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default MainRouter;