import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { AuthContext } from '../../helper/contex'
import { postReq } from '../../helper/http'
import { Button, Image, Input } from 'react-native-elements'
import { s3PreFixUrl } from '../../helper/routes'
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions'
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageAuthKey } from '../../helper/config'

const Profile = ({ navigation }: any) => {
    const { authData, setAuthData }: any = useContext(AuthContext);
    const [forgotPass, setForgotPass] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword]: any = useState(false);
    const [loader, setLoader] = useState(false);

    const validate = (val: any) => {
        if (!val) {
            setError("Password can't be blank.");
            return true
        }
        if (val && val?.search(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])(?!.*\s).{6,}$/)) {
            setError("Password must be minium 6 characters long, alteast one letter, one number and one special character!");
            return true
        }
        if (val && !val?.search(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])(?!.*\s).{6,}$/)) {
            setError("");
            return false
        }
    }

    const forgotPassword = async (val: any) => {
        setLoader(true)
        if (!validate(password)) {
            const res = await postReq({
                url: `forgot-admin-password`, data: { userId: authData?.user?.userId, password }, returnKey: "authdata"
            });
            console.log(res, 'res')
            if (res) {
                await AsyncStorage.setItem(storageAuthKey, JSON.stringify({}));
                setAuthData({});
                navigation.navigate('SignIn')
            }
        }
        setLoader(false)
    }

    const handleChange = (val: any) => {
        setPassword(val);
    }

    const clearForm = () => {
        setPassword("");
        setError("");
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Profile</Text>

                </TouchableOpacity>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <View style={style.profileCircleIcon}>
                            <Icon name="person-outline" color="#fff" size={20} />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, marginBottom: 20 }}>
                            <Text style={[style.fs22, style.boldText, style.textColorBlack]}>{authData?.user?.name ?? ""}</Text>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ marginTop: 10 }}>
                            <Input
                                label="User Id"
                                disabled={true}
                                labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                disabledInputStyle={{ color: "#93278f", fontWeight: "bold" }}
                                style={style.formGroup}
                                placeholderTextColor="#0D253C"
                                value={authData?.user?.userId}
                            />
                            <Input
                                label="Email"
                                disabled={true}
                                labelStyle={{ color: '#001B47' }}
                                disabledInputStyle={{ color: "#93278f", fontWeight: "bold" }}
                                style={style.formGroup}
                                placeholderTextColor="#0D253C"
                                value={authData?.user?.email}
                            />
                            <Input
                                label="Mobile Number"
                                disabled={true}
                                labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                disabledInputStyle={{ color: "#93278f", fontWeight: "bold" }}
                                style={style.formGroup}
                                placeholderTextColor="#0D253C"
                                value={authData?.user?.mobile_number}
                            />
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Button
                                buttonStyle={{ backgroundColor: 'transparent' }}
                                titleStyle={{ color: 'black' }}
                                title="Forgot password ?"
                                containerStyle={{
                                    width: "100%",
                                    alignItems: "flex-end"
                                }}
                                onPress={() => { setForgotPass(!forgotPass), clearForm() }}

                            />
                            {forgotPass && <>
                                <Input
                                    label="Enter New Password"
                                    labelStyle={{ color: '#001B47' }}
                                    style={style.formGroup}
                                    placeholderTextColor="#0D253C"
                                    onChangeText={val => handleChange(val)}
                                    errorStyle={{ color: 'red' }}
                                    value={password}
                                    secureTextEntry={!showPassword}
                                    rightIcon={
                                        <Icon
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            type="ionicon"
                                            color="#001B47"
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                    errorMessage={error}
                                />
                                {!!password?.length && <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                                    <TouchableOpacity onPress={forgotPassword} disabled={loader}>
                                        <View style={[style.submitButton, { width: 200 }]}>
                                            <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Set Password</Text>
                                            {loader && <ActivityIndicator color="#fff" />}
                                        </View>
                                    </TouchableOpacity>
                                </View>}
                            </>
                            }

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView >
            </View>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    dropdown: {
        marginLeft: 16,
        height: 52,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: responsiveFontSize(1.624),
    },
    selectedTextStyle: {
        fontSize: responsiveFontSize(1.856),
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: responsiveFontSize(1.856),
    },
    errorText: {
        color: "red",
        fontSize: responsiveFontSize(1.392),
        marginTop: 5
    }
});

export default Profile