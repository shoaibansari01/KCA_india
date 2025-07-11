import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { style } from '../../style/style'
import { Button, Icon, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginType from '../../components/loginType';
import { postReq } from '../../helper/http';
import { validateRegister } from '../../validate/validation';
import { countryCode, littleLegs } from '../../helper/reusableFun';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const formObj = [{ label: "Full Name", field: "name", placeholde: "Enter Full Name" }, { label: "Email", field: "email", placeholde: "Enter Email" },
{ label: " ", field: "mobile_number", placeholde: "Enter Mobile Number" }, { label: "Password", field: "password", placeholde: "Enter Password" }, { label: "Confirm Password", field: "confirm_password", placeholde: "Re-Enter Password" }];

const SignUp = ({ navigation }: any) => {
    const [values, setValues]: any = useState({})
    const [errors, setErrors]: any = useState({});
    const [loader, setLoader] = useState(false);
    const [resendOtpLoader, setResendOtpLoader] = useState(false);
    const [showPassword, setShowPassword]: any = useState({});
    const [showOtpField, setshowOtpField] = useState(false);
    const [otpErr, setOtpErr]: any = useState({});
    const [otp, setOtp] = useState();
    const [userId, setUserId] = useState('');

    const submit = async () => {
        setLoader(true);
        const newErrors = validateRegister(values);
        setErrors(newErrors);
        if (!Object.keys(newErrors)?.length) {
            const res = await postReq({
                url: "signup", data: {
                    ...values
                },
                isAuthApi: false,
                errorCallback: setErrors
            });
            if (res && res?.authdata) {
                setUserId(res?.authdata);
                setshowOtpField(true);
            }
        }
        setLoader(false);
    }

    const handleChange = (val: any, field: any) => {
        let trimmedVal = val.trim();
        let error = undefined;
        if (field == 'mobile_number' || field == 'email' || field == 'password' || field == 'confirm_password') trimmedVal = val.replace(/\s/g, '');
        if (field == 'name') trimmedVal = val.replace(/(?<![a-zA-Z])\s+/g, '');
        setValues((prev: any) => ({ ...prev, [field]: (field == 'email' ? trimmedVal?.toLowerCase() : trimmedVal) }));
        setErrors((prev: any) => ({ ...prev, [field]: error }));
    };

    const resendOtp = async () => {
        setResendOtpLoader(true);
        await postReq({
            url: "resend-otp", data: {
                userId, mobile_number: values?.mobile_number, mail: values?.email
            },
            isAuthApi: false,
            errorCallback: setOtpErr
        });
        setResendOtpLoader(false);
    }

    const verify = async () => {
        setLoader(true);
        const res = await postReq({
            url: "verify", data: {
                userId, otp
            },
            isAuthApi: false,
            errorCallback: setOtpErr
        });
        if (res?.authdata) {
            setValues({});
            setOtpErr({});
            await littleLegs(100);
            navigation.navigate('SignIn');
        }
        setLoader(false);
    }

    const handleOtp = (val: any, field: any) => setOtp(val);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ padding: 20, flex: 1 }}>
                        <Text style={style.singnUpTitle}>Sign Up</Text>
                        {formObj.map((each, idx) => (
                            <View
                                key={idx}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: "space-between",
                                    marginTop: each?.field == "mobile_number" && -40
                                }}
                            >
                                {each?.field == "mobile_number" &&
                                    <View style={{ width: '30%' }}>
                                        <Dropdown
                                            style={[styles.dropdown, { marginTop: errors?.['dialing_prefix'] ? 22 : 2 }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            search
                                            placeholder="Code"
                                            data={countryCode ?? []}
                                            value={values?.['dialing_prefix']}
                                            // disable={state}
                                            labelField="code"
                                            valueField="code"
                                            onChange={(e) => { handleChange(e?.code, 'dialing_prefix') }}
                                            itemTextStyle={{ color: '#000', fontSize: responsiveFontSize(1.392) }}
                                            activeColor={'#f4f4f4'}
                                        />
                                        {errors?.['dialing_prefix'] && <Text style={[styles.errorText, { textAlign: "center" }]}>{`${errors?.['dialing_prefix']}`}</Text>}
                                    </View>
                                }

                                <View style={{ width: each?.field == "mobile_number" ? '70%' : '100%' }}>
                                    <Input
                                        placeholder={each?.placeholde}
                                        errorStyle={{ color: 'red' }}
                                        label={each?.label}
                                        labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                        style={style.formGroup}
                                        disabled={showOtpField}
                                        placeholderTextColor="#0D253C"
                                        onChangeText={val => handleChange(val, each?.field)}
                                        value={values[each?.field]}
                                        secureTextEntry={['password', 'confirm_password'].includes(each?.field) ? !showPassword[each?.field] : false}
                                        rightIcon={
                                            ['password', 'confirm_password'].includes(each?.field) ? (
                                                <Icon
                                                    name={showPassword[each?.field] ? 'eye-off' : 'eye'}
                                                    type="ionicon"
                                                    color="#001B47"
                                                    onPress={() => setShowPassword(prev => ({
                                                        ...prev,
                                                        [each?.field]: !showPassword[each?.field]
                                                    }))}
                                                />
                                            ) : null
                                        }
                                        key={idx}
                                        errorMessage={errors[each?.field]}
                                    />
                                </View>
                            </View>
                        ))}
                        {showOtpField && (
                            <>
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
                                <View style={{ alignSelf: "flex-end", paddingEnd: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={style.otpHead}>Didn't receive? </Text>
                                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} disabled={resendOtpLoader} onPress={resendOtp} ><Text style={style.otpResend}>Resend OTP</Text>{resendOtpLoader && <View style={{ marginLeft: 2 }}>
                                            <ActivityIndicator color="#93278f" />
                                        </View>}</TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                    <TouchableOpacity onPress={(e) => { userId ? verify() : submit() }} disabled={loader}>
                        <View style={style.submitButton}>
                            <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>{userId ? "Verify" : "Sign Up"}</Text>
                            {loader && <ActivityIndicator color="#fff" />}
                        </View>
                    </TouchableOpacity>
                    <LoginType {...{ navigation, subTitle: "Already have an account", title: "SIGN IN" }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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

export default SignUp