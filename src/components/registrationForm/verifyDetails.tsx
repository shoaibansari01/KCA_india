import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerUserValidate } from '../../validate/registerUserValidation'
import { postReq } from '../../helper/http'
import { countryCode, littleLegs } from '../../helper/reusableFun'
import { Dropdown } from 'react-native-element-dropdown';
import { responsiveFontSize } from 'react-native-responsive-dimensions'

const VerifyDetails = ({ route, navigation }: any) => {
    const { data } = route.params;
    const [loader, setLoader] = useState(false);
    const [values, setValues]: any = useState({})
    const [errors, setErrors]: any = useState({});
    const [state, setState] = useState(false);
    const [otpErr, setOtpErr]: any = useState({});
    const [otp, setOtp] = useState();
    
    const submit = async () => {
        setLoader(true);
        const newErrors = registerUserValidate(values);
        setErrors(newErrors);
        if (!Object.keys(newErrors)?.length) {
            const res = await postReq({
                url: "register-user-verification", data: {
                    ...values, userId: data?.userInfo?._id
                }
            });
            if (res && res?.authdata) {
                setState(true);
                littleLegs(200);
                navigation.navigate("UserDashboard", { data: { ...data } })
            }
        }
        setLoader(false);
    }

    const verifyOtp = async () => {
        setLoader(true);
        const res = await postReq({
            url: "verify-register-user", data: {
                userId: data?.userInfo?._id, otp
            },
            errorCallback: setOtpErr
        });
        if (res && res?.authdata) {
            littleLegs(200);
            navigation.navigate("UserDashboard", { data: { ...data } })
        }
        setLoader(false);
    }

    const handleOtp = (val: any, field: any) => setOtp(val);

    const handleChange = (val: any, field: any) => {
        let trimmedVal = val?.trim();
        let error = undefined;
        if (field == 'resister_user_email' || field == 'resister_user_mobile_no') trimmedVal = val.replace(/\s/g, '');
        setValues((prev: any) => ({ ...prev, [field]: (field == 'resister_user_email' ? trimmedVal?.toLowerCase() : trimmedVal) }));
        setErrors((prev: any) => ({ ...prev, [field]: error }));
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[style.container, { width: '100%' }]}>
                {/* <TouchableOpacity onPress={() => setActiveScreen("FormStep")} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Back to RegistrationForm</Text>
            </TouchableOpacity> */}
                <Text style={style.orText}>Verify Details</Text>
                <Input
                    placeholder="Enter Email Address"
                    errorStyle={{ color: 'red' }}
                    errorMessage={errors['resister_user_email']}
                    labelStyle={{ color: '#001B47', marginBottom: 8 }}
                    style={[style.formGroup, { flex: 1 }]}
                    onChangeText={val => handleChange(val, 'resister_user_email')}
                    value={values['resister_user_email']}
                    placeholderTextColor="#0D253C"
                    disabled={state}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: "space-between", marginTop: -10 }}>
                    <View style={{ width: '30%' }}>
                        <Dropdown
                            style={[styles.dropdown, { marginTop: errors?.['country_phone_code'] ? 0 : -17 }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            search
                            placeholder="Code"
                            searchPlaceholder="Search"
                            data={countryCode ?? []}
                            value={values?.['country_phone_code']}
                            disable={state}
                            labelField="code"
                            valueField="code"
                            onChange={(e: any) => { handleChange(e?.code, 'country_phone_code') }}
                            itemTextStyle={{ color: '#000', fontSize: responsiveFontSize(1.392) }}
                            activeColor={'#f4f4f4'}
                        />
                        {errors?.['country_phone_code'] && <Text style={[styles.errorText, { textAlign: "center" }]}>{`${errors?.['country_phone_code']}`}</Text>}
                    </View>
                    <View style={{ width: '70%' }}>
                        <Input
                            placeholder="Enter Mobile Number"
                            errorStyle={{ color: 'red' }}
                            errorMessage={errors['resister_user_mobile_no']}
                            labelStyle={{ color: '#001B47', marginBottom: 8 }}
                            style={[style.formGroup, { flex: 1, marginTop: 10 }]}
                            onChangeText={val => handleChange(val, 'resister_user_mobile_no')}
                            value={values['resister_user_mobile_no']}
                            placeholderTextColor="#0D253C"
                            maxLength={10}
                            disabled={state}
                        />
                    </View>
                </View>
                {!state &&
                    <TouchableOpacity onPress={submit} disabled={loader}>
                        <View style={[style.submitButton, { alignSelf: "flex-end" }]}>
                            <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Submit</Text>
                            {loader && <ActivityIndicator color="#fff" />}
                        </View>
                    </TouchableOpacity>
                }

                {/* {state &&
                    <View>
                        <Input
                            placeholder="ENTER OTP"
                            label="Enter Otp"
                            labelStyle={{ color: '#001B47', marginBottom: 8 }}
                            style={style.formGroup}
                            placeholderTextColor="#0D253C"
                            keyboardType="numeric"
                            maxLength={6}
                            onChangeText={val => handleOtp(val, 'otp')}
                            value={otp}
                            errorMessage={otpErr?.otp}
                        />
                        <TouchableOpacity onPress={verifyOtp} disabled={loader}>
                            <View style={[style.submitButton, { alignSelf: "flex-end" }]}>
                                <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Submit</Text>
                                {loader && <ActivityIndicator color="#fff" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                } */}
            </View>
        </SafeAreaView>
    )
}
export default VerifyDetails

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
