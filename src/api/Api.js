import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

//const apiUrl = 'https://api.pauseplus.com.tr/api/';
const apiUrl = Platform.select({
    ios: 'http://localhost:5163/api/',
    android: 'http://10.0.2.2:5163/api/'
});

export const getHeadersWithToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
}


export default apiUrl;