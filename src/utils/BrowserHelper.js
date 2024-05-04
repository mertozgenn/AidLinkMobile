import { Linking } from "react-native"
import themeColor from "../theme"

export default async function openBrowser(url) {
    try {
        if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: 'close',
                animated: true,
                modalEnabled: false,
                enableBarCollapsing: true,
                preferredBarTintColor: themeColor,
                preferredControlTintColor:'white',
                // Android Properties
                showTitle: true,
                toolbarColor: themeColor,
                secondaryToolbarColor: 'black',
                navigationBarColor: 'black',
                navigationBarDividerColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                    startEnter: 'slide_in_right',
                    startExit: 'slide_out_left',
                    endEnter: 'slide_in_left',
                    endExit: 'slide_out_right'
                },
                // headers: {
                //     'my-custom-header': 'my custom header value'
                // }
            })
        }
        else Linking.openURL(url)
    } catch (error) {
        console.log(error)
    }
}