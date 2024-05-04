import apiUrl, { getHeadersWithToken } from "./Api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleErrorMessages, showSuccessToast } from '../utils/ToastHelper';
import { resetNavigation } from "../utils/NavigationHelper";

export const setIsAuthenticated = async () => {
    const options = await getHeadersWithToken();
    rawResponse = await axios.get(apiUrl + "auth/IsAuthenticated", options).catch(error => {
        handleErrorMessages(error);
    });
    AsyncStorage.setItem('isAuthenticated', rawResponse.data.toString());
    return rawResponse.data;
}

const sendLoginRequest = async (loginInfo) => {
    rawResponse = await axios.post(apiUrl + "auth/Login", loginInfo);
    return rawResponse;
}

const sendDealerLoginRequest = async (loginInfo) => {
    rawResponse = await axios.post(apiUrl + "auth/DealerLogin", loginInfo);
    return rawResponse;
}

export const logout = async (navigation) => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.setItem('isAuthenticated', 'false');
    await AsyncStorage.removeItem('memberInfo');
    navigation.replace('Splash');
}

export const login = async (loginInfo, navigation) => {
    await sendLoginRequest(loginInfo).then(response => {
        if (response.data.success) {
            AsyncStorage.setItem('userType', 'member');
            AsyncStorage.setItem('token', response.data.data.token);
            resetNavigation(navigation);
        }
    }).catch(error => {
        handleErrorMessages('Giriş Başarısız', error);
    });
}

export const dealerLogin = async (loginInfo, navigation) => {
    await sendDealerLoginRequest(loginInfo).then(response => {
        if (response.data.success) {
            AsyncStorage.setItem('userType', 'dealer');
            AsyncStorage.setItem('token', response.data.data.token);
            resetNavigation(navigation);
        }
    }).catch(error => {
        handleErrorMessages('Giriş Başarısız', error);
    });
}

export const authError = async (navigation) => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.setItem('isAuthenticated', 'false');
    await AsyncStorage.removeItem('memberInfo');
    navigation.replace('Login');
};