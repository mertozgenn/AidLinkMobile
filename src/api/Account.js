import axios from "axios";
import { handleErrorMessages, showSuccessToast } from '../utils/ToastHelper';
import apiUrl, { getHeadersWithToken } from "./Api";

const getTransactionsRequest = async () => {
    const response = await axios.get(apiUrl + 'memberAccountTransactions/getAccountTransactions', await getHeadersWithToken());
    return response;
}

const getQrCodeRequest = async () => {
    const response = await axios.get(apiUrl + 'members/getQrCode', await getHeadersWithToken());
    return response;
}

export const getTransactions = async () => {
    const response = await getTransactionsRequest().catch((error) => {
        handleErrorMessages('Hata', error);
    });
    if (response && response.data.success) {
        return response.data.data;
    }
    return [];
}

export const getQrCode = async () => {
    const response = await getQrCodeRequest().catch((error) => {
        handleErrorMessages('Hata', error);
    });
    if (response && response.data.success) {
        return response.data.data;
    }
    return '';
}