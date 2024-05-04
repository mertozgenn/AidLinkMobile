import axios from "axios";
import { handleErrorMessages } from '../utils/ToastHelper';
import apiUrl, { getHeadersWithToken } from "./Api";

const postQrPaymentRequest = async (qrPaymentDto) => {
    const response = await axios.post(apiUrl + 'payments/qrpayment', qrPaymentDto, await getHeadersWithToken());
    return response;
}

export const qrPayment = async (qrPaymentDto) => {
    const response = await postQrPaymentRequest(qrPaymentDto).catch((error) => {
        handleErrorMessages('Hata', error);
    });
    return response.data;
}