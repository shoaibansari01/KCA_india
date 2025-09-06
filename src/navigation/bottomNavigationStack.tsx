import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import { style } from '../style/style';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../views/home';
import GalleryScreen from '../views/gallery';
import ExhibitionScreen from '../views/exhibition';
import HelpScreen from '../views/help';
import RegistrationForm from '../components/registrationForm';
import AllRounderForm from '../components/AllRounderForm';
import UserDashboard from '../views/dashboard/userDashboard';
import VerifyDetails from '../components/registrationForm/verifyDetails';
import NominationForm from '../views/nominationForm';
import Brochure from '../views/forms/brochure';
import SchoolParticipationForm from '../views/forms/schoolParticipationForm';
import ParticipationForm from '../views/forms/participationForm';
import FinalFeesConformation from '../views/forms/finalFeesConformation';
import UploadData from '../views/forms/uploadData';
import ConfirmationSection from '../views/forms/confirmationSection';
import StudentParticipationForm from '../views/forms/studentParticipationForm';
import WinnerResult from '../views/forms/winnerResult';
import UploadPhotos from '../views/forms/uploadPhotos';
import MyRegistrationForm from '../views/forms/myRegistrationForm';
import UploadArtWork from '../views/forms/uploadArtWork';
import SingleExhibationImageScreen from '../views/forms/singleExhibationImageScreen';
import MyAccount from '../views/forms/myAccount';
import WebviewScreen from '../components/videoModal';
import NominiForm from '../views/nominationForm/nominiForm';
import NominiPaymentSection from '../views/nominationForm/paymentPage';
import ViewStudentData from '../views/forms/viewStudentData';
import ExcelViewerScreen from '../views/forms/excelViewerScreen';
import CertificateViewer from '../views/forms/certificateViewer';
import AllRounderContestInfo from '../components/AllRounderContestInfo';
import AllRounderPaymentScreen from '../components/AllRounderPaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={
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
            presentation="modal">
            <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='RegistrationForm'
                component={RegistrationForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='AllRounderForm'
                component={AllRounderForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='VerifyDetails'
                component={VerifyDetails}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='UserDashboard'
                component={UserDashboard}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='Brochure'
                component={Brochure}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='SchoolParticipationForm'
                component={SchoolParticipationForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='ParticipationForm'
                component={ParticipationForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='MyRegistrationForm'
                component={MyRegistrationForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='FinalFeesConformation'
                component={FinalFeesConformation}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='UploadData'
                component={UploadData}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='ViewStudentData'
                component={ViewStudentData}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='ExcelViewerScreen'
                component={ExcelViewerScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='CertificateViewer'
                component={CertificateViewer}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='ConfirmationSection'
                component={ConfirmationSection}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='StudentParticipationForm'
                component={StudentParticipationForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='WinnerResult'
                component={WinnerResult}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='MyAccount'
                component={MyAccount}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='UploadPhotos'
                component={UploadPhotos}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='UploadArtWork'
                component={UploadArtWork}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='SingleExhibationImageScreen'
                component={SingleExhibationImageScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='WebviewScreen'
                component={WebviewScreen}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='NominationForm'
                component={NominationForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='NominiForm'
                component={NominiForm}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='NominiPaymentSection'
                component={NominiPaymentSection}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='AllRounderContestInfo'
                component={AllRounderContestInfo}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='AllRounderPaymentScreen'
                component={AllRounderPaymentScreen}
                options={{ header: () => null }}
            />
        </Stack.Navigator>
    );
};


const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeStack"
            screenOptions={{
                tabBarLabelStyle: style.tabLabelStyle,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: '#93278f',
                tabBarInactiveTintColor: '#001B47',
                tabBarStyle: { height: 70 },
                headerShown: false
            }}
        >
            <Tab.Screen name="HomeStack" component={HomeStack}
                options={{
                    unmountOnBlur: true,
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} style={{ paddingTop: 10 }} />
                    ),
                }}
            />
            <Tab.Screen name="GalleryScreen" component={GalleryScreen}
                options={{
                    unmountOnBlur: true,
                    headerShown: false,
                    tabBarLabel: "Gallery",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="images-outline" color={color} size={size} style={{ paddingTop: 10 }} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        navigation.navigate('GalleryScreen')
                        e.preventDefault()
                    }
                })} />
            <Tab.Screen name="ExhibitionScreen" component={ExhibitionScreen}
                options={{
                    unmountOnBlur: true,
                    headerShown: false,
                    tabBarLabel: "Exhibition",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="apps-outline" color={color} size={size} style={{ paddingTop: 10 }} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        navigation.navigate('ExhibitionScreen')
                        e.preventDefault()
                    }
                })} />
            <Tab.Screen name="HelpScreen" component={HelpScreen}
                options={{
                    unmountOnBlur: true,
                    headerShown: false,
                    tabBarLabel: "FAQ",
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="help-circle-outline" color={color} size={size} style={{ paddingTop: 10 }} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        navigation.navigate('HelpScreen')
                        e.preventDefault()
                    }
                })} />
        </Tab.Navigator>
    );
}
export default BottomTabNavigator