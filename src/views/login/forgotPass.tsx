import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { style } from '../../style/style'
import { Button, Icon, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postReq } from '../../helper/http';
import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { validatepassword } from '../../validate/forgotPassValidation';
import { littleLegs } from '../../helper/reusableFun';

const forgotPassField = [{ label: "Password", field: "password", placeholde: "Enter Password" }, { label: "Confirm Password", field: "confirm_password", placeholde: "Re-Enter Password" }];

const ForgotPass = ({ navigation }: any) => {
    const [values, setValues]: any = useState({});
    const [loader, setLoader] = useState(false);
    const [errors, setErrors]: any = useState({});
    const [userData, setUserData]: any = useState({});
    console.log({ userData })
    const [otpSend, setOtpSend] = useState(false);
    const [otpVerify, setOtpVerify] = useState(false);
    const [showPassword, setShowPassword]: any = useState({});
    const [otp, setOtp] = useState();
    const [otpErr, setOtpErr]: any = useState({});

    const formObj = [
        { label: "Email or Mobile", field: "userId", validation: (value: any) => /\S+@\S+\.\S+/.test(value) }
    ];

    const validate = (values: any) => {
        let errors: any = {};
        formObj.forEach(field => {
            const { label, field: fieldName, validation } = field;
            const value = values[fieldName];
            if (!value) errors[fieldName] = `${label} is required`;
            if (fieldName === 'userId') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const mobileRegex = /^[0-9]{10}$/;
                if (!emailRegex.test(value) && !mobileRegex.test(value)) errors[fieldName] = `Not a valid email address or mobile number`;
            }
        });
        return errors;
    };

    const submit = async () => {
        setLoader(true);
        const newErrors = validate(values);
        setErrors(newErrors);
        if (!Object.keys(newErrors)?.length) {
            const res = await postReq({
                url: "forgot-password", data: {
                    ...values
                },
                isAuthApi: false,
                errorCallback: setErrors
            });
            if (res && res?.authdata) {
                setValues({})
                setUserData(res?.authdata);
                setOtpSend(true);
            }
        }
        setLoader(false);
    }

    const handleOtp = (val: any, field: any) => setOtp(val);

    const resendOtp = async () => {
        await postReq({
            url: "resend-otp", data: {
                userId: userData?.id, mobile_number: userData?.mobile_number, mail: userData?.email, mailFor: "forgotPass"
            },
            isAuthApi: false,
            errorCallback: setOtpErr
        });
    }

    const verifyOtp = async () => {
        setLoader(true);
        const res = await postReq({
            url: "verify", data: {
                userId: userData?.id, otp, forPass: true
            },
            isAuthApi: false,
            errorCallback: setOtpErr
        });
        if (res?.authdata) {
            setOtpSend(false);
            setOtpVerify(true);
        }
        setLoader(false);
    }

    const forgotPassword = async () => {
        setLoader(true);
        const newErrors = validatepassword(values);
        setErrors(newErrors);
        if (!Object.keys(newErrors)?.length) {
            const res = await postReq({
                url: "reset-password", data: {
                    ...values, userId: userData?.id
                },
                isAuthApi: false,
                errorCallback: setErrors
            });
            if (res && res?.authdata) {
                await littleLegs(200);
                navigation.navigate('SignIn');
                setOtpSend(false);
                setOtpVerify(false);
                setValues({});
            }
        }
        setLoader(false);
    }

    const handleChange = (val: any, field: any) => {
        let trimmedVal = val.replace(/\s/g, '');
        setValues((prev: any) => ({ ...prev, [field]: (field == 'userId' ? trimmedVal.toLowerCase() : trimmedVal) }));
        setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    };

    const handlePassChange = (val: any, field: any) => {
        let trimmedVal = val.trim();
        let error = undefined;
        if (field == 'password' || field == 'confirm_password') trimmedVal = val.replace(/\s/g, '');
        setValues((prev: any) => ({ ...prev, [field]: trimmedVal }));
        setErrors((prev: any) => ({ ...prev, [field]: error }));
    };


    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <Text style={[style.singnUpTitle, { marginTop: 70, marginBottom: 30 }]}>Forgot Password</Text>
                {!otpSend && !otpVerify && <>
                    {formObj?.map(({ field, label }, i) =>
                        <Input
                            key={i}
                            placeholder={`Enter ${label}`}
                            errorStyle={{ color: 'red' }}
                            label={label}
                            value={values[field]}
                            style={style.formGroup}
                            labelStyle={{ color: '#001B47', marginBottom: 8 }}
                            placeholderTextColor="#0D253C"
                            onChangeText={val => handleChange(val, field)}
                            errorMessage={errors[field]}
                        />
                    )}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={submit} disabled={loader}>
                            <View style={style.submitButton}>
                                <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Submit</Text>
                                {loader && <ActivityIndicator color="#fff" />}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hvAccountStyle} onPress={() => navigation.navigate('SignIn')} >
                            <Text style={styles.forgetPassText}>Back to Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </>}

                {otpSend && <>
                    <Input
                        placeholder="ENTER OTP"
                        label="Enter Otp"
                        labelStyle={{ color: '#001B47' }}
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
                            <TouchableOpacity onPress={resendOtp} ><Text style={style.otpResend}>Resend OTP</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <TouchableOpacity onPress={verifyOtp} disabled={loader}>
                            <View style={style.submitButton}>
                                <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Verify</Text>
                                {loader && <ActivityIndicator color="#fff" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
                }

                {!otpSend && otpVerify && <>
                    {forgotPassField?.map((each, idx) =>
                        <Input
                            placeholder={each?.placeholde}
                            errorStyle={{ color: 'red' }}
                            label={each?.label}
                            labelStyle={{ color: '#001B47', marginBottom: 8 }}
                            style={style.formGroup}
                            placeholderTextColor="#0D253C"
                            onChangeText={val => handlePassChange(val, each?.field)}
                            value={values[each?.field]}
                            secureTextEntry={['password', 'confirm_password'].includes(each?.field) ? !showPassword[each?.field] : false}
                            rightIcon={
                                ['password', 'confirm_password'].includes(each?.field) ? (
                                    <Icon
                                        name={showPassword[each?.field] ? 'eye-off' : 'eye'}
                                        type="ionicon"
                                        color="#001B47"
                                        onPress={() => setShowPassword((pre: any) => ({
                                            ...pre
                                            , [each?.field]: !showPassword[each?.field]
                                        }))}
                                    />
                                ) : null
                            }
                            key={idx}
                            errorMessage={errors[each?.field]}
                        />
                    )}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={forgotPassword} disabled={loader}>
                            <View style={[style.submitButton, { width: 200 }]}>
                                <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Set Password</Text>
                                {loader && <ActivityIndicator color="#fff" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </>}


            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        // margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: responsiveFontSize(1.856),
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
    },
    hvAccountStyle: {
        alignItems: 'center',
        marginTop: responsiveHeight(1),
    },
    forgetPassText: {
        color: "#93278f",
        textDecorationColor: "#93278f",
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        fontSize: responsiveFontSize(1.8)
    },
});

export default ForgotPass