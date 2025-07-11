import { View, Text, Animated, Image } from 'react-native'
import React from 'react'
import { style } from '../style/style';
import logo from '../assets/images/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
    const animatedValue = new Animated.Value(0.1);
    Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
    }).start();

    return (
        <SafeAreaView>
            <View style={style.homeScreen}>
                <Animated.View
                    style={{
                        transform: [{ scale: animatedValue }],
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Image source={logo} style={{ width: 110, height: 110 }} />
                    <Text style={style.splashScreenTxt}>KIDS' CEREBRAL ACADEMY</Text>
                </Animated.View>

            </View>
        </SafeAreaView>

    );
};

export default SplashScreen