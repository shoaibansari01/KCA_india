import { View, Text } from 'react-native'
import React from 'react'
import { style } from '../../style/style';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { createStackNavigator } from '@react-navigation/stack';

import Photos from './photos';
import { Videos } from './videos';
import Details from './details';
import WebviewScreen from '../../components/videoModal';
// import Video from 'react-native-video';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const GalleryData = () => <View style={{ flex: 1 }}>
    <View style={{ padding: 20 }}>
        <Text style={style.pageHeading}>Gallery</Text>
        <Text style={style.pageSubHead}>
            National Talent Search Drawing and Painting Scholarship Competition-2024
        </Text>
    </View>
    <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: '#93278f',
            tabBarInactiveTintColor: '#001B47',
            tabBarLabelStyle: { fontWeight: 'bold' },
            tabBarIndicatorStyle: {
                borderBottomColor: '#93278f',
                borderBottomWidth: 2,
            },
        }}
    >
        <Tab.Screen name="Photos" component={Photos} />
        <Tab.Screen name="Videos" component={Videos} />
    </Tab.Navigator>
</View>


const GalleryScreen = () => (
    <Stack.Navigator
        initialRouteName="GalleryData"
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen
            name="GalleryData"
            component={GalleryData}
        />
        <Stack.Screen
            name="Details"
            component={Details}
        />
        <Stack.Screen
                name='WebviewScreen'
                component={WebviewScreen}
                options={{ header: () => null }}
            />
    </Stack.Navigator>
);

export default GalleryScreen