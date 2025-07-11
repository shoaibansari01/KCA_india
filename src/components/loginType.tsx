import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const LoginType = ({ navigation, subTitle, title }: any) => {
    return (
        <View>
            <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ marginVertical: 15 }}>
                    {subTitle}?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate(title == "SIGN UP" ? "SignUp" : "SignIn")}>
                    <Text style={{ color: '#93278f' }}>
                        {" "}{title}
                    </Text>
                </TouchableOpacity>
            </View>
            {/* <View style={{ paddingHorizontal: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#979797', marginRight: 10 }} />
                <Text>OR</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#979797', marginLeft: 10 }} />
            </View> */}
        </View>
    )
}

export default LoginType