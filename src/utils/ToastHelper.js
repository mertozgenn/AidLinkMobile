import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';
import themeColor from '../theme';

export const showSuccessToast = (text1, text2) => {
    Toast.show({
        type: 'success',
        text1: text1,
        text2: text2,
    });
};

export const showErrorToast = (text1, text2) => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2,
    });
}

export const handleErrorMessages = (title,  error) => {
    console.log(error)
    if (error.response.data.Errors) {
        message = ""
        error.response.data.Errors.forEach(element => {
            message += element.ErrorMessage + "\n";
        });
        showErrorToast(title, message);
    }
    else if (error.response.data.success == false) {
        showErrorToast(title, error.response.data.message);
    }
    else {
        showErrorToast(title, error.response.data.Message);
    }
}

export const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
        <SuccessToast
            {...props}
            style={{ borderLeftColor: themeColor }}
            text1Style={{
                fontSize: 14,
                fontFamily: 'Poppins-Bold'
            }}
            text2Style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular'
            }}
        />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 14,
                fontFamily: 'Poppins-Bold'
            }}
            text2Style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular'
            }}
        />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: ({ text1, props }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
            <Text>{props.uuid}</Text>
        </View>
    )
};