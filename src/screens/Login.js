import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, ActivityIndicator } from 'react-native-paper';
import { login, dealerLogin } from '../api/Authentication';
import { showErrorToast, toastConfig } from '../utils/ToastHelper';
import Toast from 'react-native-toast-message';
import themeColor from '../theme';

const Login = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: '',
    });

    const formTouched = useRef(false)
    // Validation
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const isFieldValid = (test, setValidFunction) => {
        let result = test
        if (formTouched.current == true)
            setValidFunction(result)
        return result
    }
    const isEmailValid = (text) => isFieldValid(text.length != 0, setEmailValid);
    const isPasswordValid = (text) => isFieldValid(text.length != 0, setPasswordValid);
    const checkValidation = () => {
        if (isEmailValid(loginInfo.username) & isPasswordValid(loginInfo.password)) {
            return true;
        }
        return false;
    }

    //login
    const handleLogin = async () => {
        formTouched.current = true
        if (checkValidation()) {
            setLoading(true);
            await login(loginInfo, navigation)
            setLoading(false);
        }
        else {
            showErrorToast('Giriş Başarısız', 'Lütfen bilgilerinizi kontrol edin.');
        }
    }

    const handleDealerLogin = async () => {
        formTouched.current = true
        if (checkValidation()) {
            setLoading(true);
            await dealerLogin(loginInfo, navigation)
            setLoading(false);
        }
        else {
            showErrorToast('Giriş Başarısız', 'Lütfen bilgilerinizi kontrol edin.');
        }
    }

    return (
        <>
            <KeyboardAwareScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/images/pause-logo.png')} style={styles.logo}></Image>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        label="Kullanıcı Adı"
                        value={loginInfo.username}
                        onChangeText={text => {
                            setLoginInfo({ ...loginInfo, username: text })
                            isEmailValid(text)
                        }}
                        style={styles.inputStyle}
                        activeUnderlineColor={themeColor}
                        contentStyle={styles.inputContentStyle}
                        keyboardType='default'
                        error={!emailValid}
                        textContentType='nickname'
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect={false}
                    />
                    {!emailValid && <HelperText type='error' style={styles.errorText}>Lütfen geçerli bir kullanıcı adı giriniz.</HelperText>}
                    <TextInput
                        label="Şifre"
                        value={loginInfo.password}
                        onChangeText={text => {
                            setLoginInfo({ ...loginInfo, password: text })
                            isPasswordValid(text)
                        }}
                        style={styles.inputStyle}
                        activeUnderlineColor={themeColor}
                        contentStyle={styles.inputContentStyle}
                        secureTextEntry={true}
                        error={!passwordValid}
                        textContentType='password'
                        autoCapitalize='none'
                        autoComplete='password'
                        autoCorrect={false}
                    />
                    {!passwordValid && <HelperText type='error' style={styles.errorText}>Şifrenizi giriniz.</HelperText>}
                </View>
                {loading &&
                    <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator size={'small'} animating={true} color={themeColor} />
                    </View>
                }
                {!loading &&
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
                            <Text style={styles.loginButtonText}>Üye Girişi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton} onPress={() => handleDealerLogin()}>
                            <Text style={styles.loginButtonText}>İşletme Girişi</Text>
                        </TouchableOpacity>
                    </View>}
            </KeyboardAwareScrollView>
            <Toast config={toastConfig} />
        </>
    )
}

export default Login

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainerStyle: {
        padding: 25
    },
    logoContainer: {
        height: 200,
        width: '100%',
        alignSelf: 'center'
    },
    logo: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    inputStyle: {
        backgroundColor: 'transparent',
        marginBottom: 20,
        marginLeft: 0,
    },
    inputContentStyle: {
        color: '#202020',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: themeColor,
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 40,
        minHeight: 50,
        width: '40%',
    },
    loginButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        textAlign: 'center',
    },
    errorText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
    },
    appleButton: {
        width: '100%',
        height: 50,
        alignSelf: 'center',
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    forgotPasswordButton: {
        padding: 5,
    },
    forgotPasswordText: {
        color: themeColor,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
    },
    activityIndicatorContainer: {
        padding: 15,
        marginTop: 20,
        marginBottom: 40,
        height: 50,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})