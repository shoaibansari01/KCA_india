import React, { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import SignUp from '../views/login/signUp';
import { AuthContext } from './contex';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageAuthKey } from './config';
import SignIn from '../views/login/signIn';
import ForgotPass from '../views/login/forgotPass';
import DrawerNavigator from '../navigation/drawerNavigator';
import BottomTabNavigator from '../navigation/bottomNavigationStack';
import AboutUs from '../views/drawerScreen/aboutUs';
import TermAndCond from '../views/drawerScreen/termAndCond';
import Policys from '../views/drawerScreen/policys';
import { KeyboardAvoidingView, Linking, Platform } from 'react-native';
import Favourite from '../views/drawerScreen/favourite';
import PaymentDetails from '../views/paymentDetails';
import PaymentDetailsView from '../views/paymentDetails/details';
import MyDasboards from '../views/myDashbaords';
import Certificates from '../views/drawerScreen/certificates';
import Notification from '../views/notification';
import Profile from '../views/drawerScreen/myProfile';
const Stack = createStackNavigator();
export const s3PreFixUrl = "https://kca-bucket.s3.ap-south-1.amazonaws.com/";

const Routes = () => {
    const { authData, setAuthData }: any = useContext(AuthContext);
    const navRef:any = useRef()
    useEffect(() => {
        // handles deep link when app is already open
        Linking.addEventListener('url', evt => console.log(evt.url));

        // handles deep link when app is not already open
        Linking.getInitialURL()
            .then(async (url: any) => {
                if (`${url}`.includes("kcagroup") && navRef.current.navigate) {
                    const [formId, pictureID] = url.split("/").slice(-2);
                    navRef.current.navigate(`SingleExhibationImageScreen`, { data: { pictureID, formId } })
                }
                console.log('Initial URL:', url)
            })
            .catch(console.warn);

        (async () => {
            const itemData: any = await AsyncStorage.getItem(storageAuthKey);
            const x = JSON.parse(itemData);
            setAuthData(x);
        })()

        return () => {
            // clears listener when component unmounts
            Linking.removeAllListeners('url');
        };
    }, []);

    return (
        <NavigationContainer ref={navRef}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {!authData?.user && (<Stack.Navigator screenOptions={
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

                </Stack.Navigator>)}
                {!!authData && !!Object.keys(authData)?.length &&
                    (<Stack.Navigator screenOptions={
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
                        presentation="modal" >
                        <Stack.Screen
                            name='DrawerNavigator'
                            component={DrawerNavigator}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='BottomTabNavigator'
                            component={BottomTabNavigator}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='AboutUs'
                            component={AboutUs}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='Profile'
                            component={Profile}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='Notification'
                            component={Notification}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='Favourite'
                            component={Favourite}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='Certificates'
                            component={Certificates}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='TermAndCond'
                            component={TermAndCond}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='Policys'
                            component={Policys}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='PaymentDetails'
                            component={PaymentDetails}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='PaymentDetailsView'
                            component={PaymentDetailsView}
                            options={{ header: () => null }}
                        />
                        <Stack.Screen
                            name='MyDasboards'
                            component={MyDasboards}
                            options={{ header: () => null }}
                        />

                    </Stack.Navigator>)
                }
            </KeyboardAvoidingView>
        </NavigationContainer>
    );
};
export default Routes;
