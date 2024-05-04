import { CommonActions } from '@react-navigation/native';

export const resetNavigation = (navigation) => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
        })
    );
}

export const navigateByResettingStack = (navigation, routeName) => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: routeName }],
        })
    );
}