import React, { useContext, useState } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { style } from '../../style/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, Input, Text } from 'react-native-elements';
import LoginType from '../../components/loginType';
import { fileDownloader, postReq, RAZORPAY_KEY } from '../../helper/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { accessTokenKey, storageAuthKey } from '../../helper/config';
import { AuthContext } from '../../helper/contex';
import ReactNativeBlobUtil from 'react-native-blob-util';

const SignIn = ({ navigation }: any) => {
    const { setAuthData }: any = useContext(AuthContext);
    const [values, setValues]: any = useState({});
    const [loader, setLoader] = useState(false);
    const [errors, setErrors]: any = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const formObj = [
        { label: "Email or Mobile", field: "userId", validation: (value: any) => /\S+@\S+\.\S+/.test(value) },
        { label: "Password", field: "password" }
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
                url: "login", data: {
                    ...values
                },
                isAuthApi: false,
                errorCallback: setErrors
            });

            if (res) {
                const { authdata } = res;
                const { accessToken, user, refreshToken }: any = authdata;
                await setAuthData(authdata);
                await AsyncStorage.setItem(storageAuthKey, JSON.stringify({ user }));
                await AsyncStorage.setItem(accessTokenKey, JSON.stringify({ accessToken, refreshToken }));
            }
        }
        setLoader(false);
    }

    const handleChange = (val: any, field: any) => {
        let trimmedVal = val.replace(/\s/g, '');
        setValues((prev: any) => ({ ...prev, [field]: (field == 'userId' ? trimmedVal.toLowerCase() : trimmedVal) }));
        setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    };

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <Text style={style.singnInTitle}>Sign In</Text>
                {formObj.map(({ field, label }, i) =>
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
                        secureTextEntry={field == 'password' ? !showPassword : false}
                        rightIcon={
                            field == 'password' ? (
                                <Icon
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    type="ionicon"
                                    color="#001B47"
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            ) : null
                        }
                    />
                )}
                <Button
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: 'black' }}
                    title="Forgot ?"
                    containerStyle={{
                        width: 100,
                        marginStart: "auto"
                    }}
                    onPress={() => navigation.navigate('ForgotPass')}

                />
            </View>
            <TouchableOpacity onPress={submit} disabled={loader}>
                <View style={style.submitButton}>
                    <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Sign In</Text>
                    {loader && <ActivityIndicator color="#fff" />}
                </View>
            </TouchableOpacity>
            <LoginType  {...{ navigation, subTitle: "Don’t have an account", title: "SIGN UP" }} />
        </SafeAreaView>
    );
}

export default SignIn;
