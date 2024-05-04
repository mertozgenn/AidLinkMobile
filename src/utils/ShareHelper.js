import { Share, Platform } from 'react-native';
const onShare = async (url) => {
    const content = {}
    if (Platform.OS === 'ios') {
        content.url = url
    } else {
        content.message = url
    }
    await Share.share(content);
};

export default onShare;