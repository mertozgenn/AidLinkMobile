import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleErrorMessages } from '../utils/ToastHelper';
import apiUrl, { getHeadersWithToken } from "./Api";
import { showSuccessToast } from "../utils/ToastHelper";
import { authError, logout } from "./Authentication";

const getMemberInfoRequest = async () => {
    const response = await axios.get(apiUrl + 'members/getMemberDetails', await getHeadersWithToken());
    return response;
};

const changePasswordRequest = async (newPassword) => {
    const body = JSON.stringify(newPassword);
    const response = await axios.post(apiUrl + 'members/updatePassword', body, await getHeadersWithToken());
    return response;
};

const updateMemberInfoRequest = async (memberInfo) => {
    const body = JSON.stringify(memberInfo);
    const response = await axios.post(apiUrl + 'members/updateMemberInfo', body, await getHeadersWithToken())
    return response;
};

export const setMemberInfo = async (navigation) => {
    await getMemberInfoRequest().then(response => {
        const memberInfo = response.data.data;
        AsyncStorage.setItem('memberInfo', JSON.stringify(memberInfo));
    }).catch(error => {
        handleErrorMessages('Hata', error);
        authError(navigation);
    });
}

export const getMemberInfo = async () => {
    const memberInfo = await AsyncStorage.getItem('memberInfo');
    return JSON.parse(memberInfo);
}

export const getCurrentMemberInfo = async () => {
    const response = await getMemberInfoRequest().catch(error => {
        handleErrorMessages('Hata', error);
    });
    if (response && response.data.success) {
        return response.data.data;
    }
}

export const updateMemberInfo = async (memberInfo, navigation) => {
    await updateMemberInfoRequest(memberInfo).then(response => {
        if (response.data.success) {
            showSuccessToast('Başarılı', response.data.message);
            navigation.replace('Splash');
        }
    }).catch(error => {
        handleErrorMessages('Hata', error);
    });
}

export const changePassword = async (newPassword, navigation) => {
    await changePasswordRequest(newPassword).then(response => {
        if (response.data.success) {
            showSuccessToast('Başarılı', response.data.message);
            navigation.replace('Splash');
        }
    }).catch(error => {
        handleErrorMessages('Hata', error);
    });
}

