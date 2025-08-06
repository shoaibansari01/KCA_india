import { View, Text, Animated, Image, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { style } from '../style/style';
import logo from '../assets/images/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const UpdateScreen = ({ handleUpdate }: any) => {

    return (
        <SafeAreaView>
            <View style={style.homeScreen}>
                <Image source={logo} style={{ width: 100, height: 100 }} />
                <Text style={style.splashScreenTxt}>KIDS' CEREBRAL ACADEMY</Text>
                <TouchableOpacity onPress={handleUpdate}>
                    <View style={[style.submitButton, { padding: 0, marginTop: 20, width: responsiveWidth(50) }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", margin: 0 }}>Update Available</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );
};

export default UpdateScreen