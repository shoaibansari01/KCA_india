import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'react-native-elements';
import SplashScreen from './src/components/splashScreen';
import Routes from './src/helper/routes';
import { AuthContext } from './src/helper/contex';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageAuthKey } from './src/helper/config';
import { littleLegs } from './src/helper/reusableFun';
import SpInAppUpdates, {
    IAUUpdateKind,
} from 'sp-react-native-in-app-updates';
import VersionCheck from 'react-native-version-check';
import UpdateAppScreen from './src/components/updataAppScreen';
import RNRestart from 'react-native-restart';
import { Linking } from 'react-native';
import UpdateScreen from './src/components/updateReqScreen';
import { appUpdateTrigger } from './src/helper/http';

const App = () => {
    const [isLoading, setLoading] = useState(true);
    const [authData, setAuthData]: any = useState({});
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const [updtLoader, setUpdtLoader] = useState(false);
    const inAppUpdates = new SpInAppUpdates(
        false
    );

    const handleUpdate = async () => {
        await AsyncStorage.clear();
        const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kcagroup&pcampaignid=web_share";
        Linking.openURL(playStoreUrl);
        // setUpdtLoader(true);
        // await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.FLEXIBLE });
        // setUpdtLoader(false);
        // RNRestart.Restart();
    };



    useEffect(() => {
        (async () => {
            try {
                const currentVersion = VersionCheck.getCurrentVersion();
                const latestVersion = await VersionCheck.getLatestVersion();
                const needUpdate = await VersionCheck.needUpdate({
                    currentVersion,
                    latestVersion
                });
                if (needUpdate.isNeeded && appUpdateTrigger) setIsUpdateRequired(true);
            } catch (error) {
                console.error("Error checking for updates:", error);
            }
        })();
    }, []);


    useEffect(() => {
        const loadAppData = async () => {
            await littleLegs(1000);
            setLoading(false);
        };
        loadAppData();
    }, []);

    useEffect(() => {
        (async () => {
            const itemData: any = await AsyncStorage.getItem(storageAuthKey);
            const x = JSON.parse(itemData);
            setAuthData(x);
        })()
    }, []);

    return (
        <ThemeProvider>
            <AuthContext.Provider value={{ authData, setAuthData }}>
                {isLoading ?
                    <SplashScreen />
                    : isUpdateRequired ? <UpdateScreen {...{ handleUpdate }} /> : <Routes />}
            </AuthContext.Provider>
        </ThemeProvider>
    );
}

export default App