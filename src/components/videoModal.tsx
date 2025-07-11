import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    BackHandler,
    Platform,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native';
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { s3PreFixUrl } from '../helper/routes';

const REFERENCE_WIDTH = 414;
const REFERENCE_HEIGHT = 736;

const { height, width } = Dimensions.get('window');

const horizScale = val => width * (val / REFERENCE_WIDTH);

const vertScale = val => height * (val / REFERENCE_HEIGHT);

const WebviewScreen = ({ route, navigation }: any) => {
    const [canGoBack, setCanGoBack] = useState(false);
    const webViewRef = useRef(null);
    const webUri = route.params.url;
    const backBtn = route?.params?.backBtn || false;

    const onAndroidBackPress = useCallback(() => {
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
            return true;
        }
        return false;
    }, [canGoBack]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
        }
        return () => {
            if (Platform.OS === 'android') {
                BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
            }
        };
    }, [onAndroidBackPress]);

    return (
        <SafeAreaView style={styles.containar}>

            <View style={styles.backView}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="#000" size={22} style={{ marginRight: 14 }} />
                    <Text style={styles.backTxt}>Back</Text>
                </TouchableOpacity>
            </View>
            <WebView
                source={{ uri: `${s3PreFixUrl}${webUri}` }}
                ref={webViewRef}
                style={styles.containar}
                startInLoadingState={true}
                onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
            />
        </SafeAreaView>
    );
};

export default WebviewScreen;

const styles = StyleSheet.create({
    containar: {
        flex: 1,
    },
    backView: {
        backgroundColor: "#fff",
        padding: horizScale(10),
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backTxt: {
        color: "#000",
        fontSize: 12,
        fontWeight: '500',
        marginHorizontal: horizScale(3),
    },
    backIcon: {
        height: horizScale(18),
        width: horizScale(18),
        resizeMode: 'contain',
    },
});
