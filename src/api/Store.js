import axios from "axios";
import apiUrl, { getHeadersWithToken } from "./Api";
import { handleErrorMessages } from '../utils/ToastHelper';

const getStoresRequest = async () => {
    const response = await axios.get(apiUrl + 'stores/getStores', await getHeadersWithToken())
    return response;
}

export const getStores = async () => {
    const response = await getStoresRequest().catch((error) => {
        handleErrorMessages('Hata', error);
    });
    if (response && response.data.success == true) {
        return response.data.data;
    }
    else {
        return [];
    }
}
