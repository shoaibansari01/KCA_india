import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { style } from '../../style/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Text } from 'react-native-elements';
import SignIn from './signIn';
import SignUp from './signUp';
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import ForgotPass from './forgotPass';

const Login = () => {
    const Stack = createStackNavigator();
    const [show, setShow] = useState(false);
    const handleSignUpPress = () => setShow(!show);

    return (
        <Stack.Navigator initialRouteName="SignIn" screenOptions={
            {
                headerShown: false,
                cardOverlayEnabled: false,
                ...TransitionPresets.SlideFromRightIOS,
                transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec,
                },
                navigationOptions: {
                    gesturesEnabled: false
                }
            }
        }
            presentation="modal"
        >
            <Stack.Screen
                name='SignIn'
                component={SignIn}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='SignUp'
                component={SignUp}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='ForgotPass'
                component={ForgotPass}
                options={{ header: () => null }}
            />
            {/* <Stack.Screen
                name='ForgetPassword'
                component={ForgetPassword}
                options={{ header: () => null }}
            /> */}

        </Stack.Navigator>
        // <>
        //     {
        //         show ? <SignUp {...{ handleSignUpPress }} /> : <SignIn {...{ handleSignUpPress }} />
        //     }
        // </>
    );
}

export default Login;
