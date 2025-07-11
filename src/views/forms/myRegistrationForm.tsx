import { View, Text, TouchableOpacity, Image, ScrollView, Modal, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { style } from '../../style/style'
import useForm from '../../hook/useForm'
import { Input, Button } from 'react-native-elements'
import DropDown from '../../components/dropDown'
import { postReq } from '../../helper/http'
import { Animated } from 'react-native';
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { impNotes, registrationFormFormat } from '../../components/registrationForm'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import TermAndCond from '../../components/termAndCond'

const MyRegistrationForm = ({ route, navigation }: any) => {
    const { data, title } = route.params;

    const [formData, setFormData]: any = useState(data?.values?.formData && JSON.parse(data?.values?.formData));
    const [formObj, setFormObj] = useState(data?.values?.formData && JSON.parse(data?.values?.formData)?.reduce((a: any, c: any) => {
        a[c?.name] = ""
        return a;
    }, {}));
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [updatedData, setUpdatedData] = useState({});
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const [expanded, setExpanded] = useState(false);

    const submit = async () => {
        setLoader(true);
        const res = await postReq({
            url: "updt-user-registration", data: { ...data?.values, ...values, formData: JSON.stringify(formData), }
        });
        if (res && res?.authdata) {
            setUpdatedData({ ...res?.authdata })
            setShowModal(true)
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1800,
                useNativeDriver: true,
            }).start();
        }
        setLoader(false);
    }

    const validate = (values: any) => {
        let errors: any = {};
        formData.forEach((element: any) => {
            if (element?.name == "name_of_participant") {
                if (!values[element?.name]?.trim()) {
                    errors[element?.name] = "Name of participant can't be blank.";

                } else if (/[^a-zA-Z\s]/.test(values[element?.name])) {
                    errors[element?.name] = "Name of participant should not contain special characters.";
                }
            }
            if (element?.name == "dob_of_participant") !values[element?.name]?.trim() && (errors[element?.name] = "DOB can't be blank.");
            if (element?.name == "category") !values[element?.name]?.trim() && (errors[element?.name] = "Category can't be blank.");
            if (element?.name == "class_name") !values[element?.name]?.trim() && (errors[element?.name] = "Class name can't be blank.");
            if (element?.name == "school_name") !values[element?.name]?.trim() && (errors[element?.name] = "School name can't be blank.");
            if (element?.name == "std_qualification") !values[element?.name]?.trim() && (errors[element?.name] = "Qualification can't be blank.");
            if (element?.name == "name_of_clg") !values[element?.name]?.trim() && (errors[element?.name] = "Collage name can't be blank.");
            if (element?.name == "artist_profession") !values[element?.name]?.trim() && (errors[element?.name] = "Profession can't be blank.");
            if (element?.name == "school_add") !values[element?.name]?.trim() && (errors[element?.name] = "Address can't be blank.");
            if (element?.name == "college_add") !values[element?.name]?.trim() && (errors[element?.name] = "Address can't be blank.");
            if (element?.name == "country") !values[element?.name]?.trim() && (errors[element?.name] = "Country can't be blank.");
            if (element?.name == "city") !values[element?.name]?.trim() && (errors[element?.name] = "City can't be blank.");
            if (element?.name == "principal_name") !values[element?.name]?.trim() && (errors[element?.name] = "Principal name can't be blank.");
            if (element?.name == "name_of_art_teacher") !values[element?.name]?.trim() && (errors[element?.name] = "Art teacher name can't be blank.");
            if (["school_email", "std_email", "email_of_school", "artist_email", "art_teacher_email"].includes(element?.name)) {
                if (!values[element?.name]?.trim()) {
                    errors[element?.name] = "Email can't be blank.";
                } else if (!/\S+@\S+\.\S+/.test(values[element?.name])) {
                    errors[element?.name] = 'Email is invalid.';
                } else if ((values[element?.name].match(/@/g) || []).length > 1) {
                    errors[element?.name] = 'Email should contain only one "@" symbol.';
                }
            }
            if (["std_number", "contact_number_of_school", "artist_contact_number", "art_teacher_number", "school_contact_number"].includes(element?.name)) {
                if (!values[element?.name]?.trim()) {
                    errors[element?.name] = "Mobile no. can't be blank.";
                } else if (values[element?.name].length !== 10) {
                    errors[element?.name] = "Mobile no. must be 10 digits long.";
                } else if (!/^[6-9]\d{9}$/.test(values[element?.name])) {
                    errors[element?.name] = "Invalid Mobile no.";
                }
            }
            if (["pin", "school_pin"].includes(element?.name)) {
                if (!values[element?.name]?.trim()) {
                    errors[element?.name] = "Pin Code can't be blank.";
                } else if (!(/^\d{6}$/.test(values[element?.name]))) {
                    errors[element?.name] = "Invalid pin code";
                }
            }
        });
        return errors;
    }

    const { handleChange, handleSubmit, values, errors, setErrors, setValues } = useForm(
        submit,
        validate,
        formObj
    );

    const checkCate = (val: any, name: any) => (name == "category") && setSelected(val);

    const closeModal = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(async () => {
            navigation.navigate('UserDashboard', { data: { values: { ...updatedData }, level: data?.level } })
        });
    };

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1);

    useMemo(() => {
        if (selected?.length) {
            const _name = [...registrationFormFormat?.global[0], ...registrationFormFormat?.global[1]?.[selected], ...registrationFormFormat?.global[2]?.[selected]].reduce((a: any, c: any) => {
                a.push(c?.name)
                return a;
            }, []);
            const _data = [...formData, , ...registrationFormFormat?.global[1]?.[selected], ...registrationFormFormat?.global[2]?.[selected]];
            const _: any = [];
            const mainData = _data.reduce((a, c) => {
                if (c?.name && _name.includes(c.name) && !_.some((obj: any) => obj.name === c.name)) {
                    _.push(c);
                    a.push(c);
                }
                return a;
            }, [])
            setFormData(_);
        }
    }, [selected])

    useEffect(() => {
        setValues(data?.values);
    }, [data?.values])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Registration Form</Text>
                </TouchableOpacity>
                <View style={{ marginBottom: 10 }}>
                    <TermAndCond {...{ data: impNotes[data?.level], expanded, setExpanded }} />
                </View>
                <View>
                    <Text style={{ color: "#93278f", fontWeight: "500", fontSize: 23, textAlign: "center", marginBottom: 20 }}>Update Your Registration Form</Text>
                </View>
                {data?.level != "global" ?
                    <>

                        <ScrollView>
                            {formData?.map(({ type, placeholder, label, opt, dependOn, name }: any, i: any) => (
                                dependOn?.depend_val == values[dependOn?.depend_field] &&
                                <View key={i}>
                                    {type == "text" ? <Input
                                        placeholder={placeholder}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={errors[name]}
                                        label={label}
                                        labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                        style={style.formGroup}
                                        placeholderTextColor="#0D253C"
                                        key={i}
                                        onFocus={() => setExpanded(expanded && false)}
                                        value={values[name]}
                                        onChangeText={(val) => { handleChange({ name, value: val }), setErrors((pre: any) => ({ ...pre, [name]: val ? "" : `${name?.replace(/_/g, ' ')} is required` })), setExpanded(expanded && false) }}
                                    /> : <View style={style.selectBox}>
                                        <Text style={style.selectLabel}>{`${label}`}</Text>
                                        <DropDown {...{ data: opt, label, handleChange, name, values, errors, setErrors, setExpanded, expanded }} />
                                    </View>
                                    }

                                </View>

                            ))}
                            {!data?.isPaymentDone && <View style={{ flexDirection: "row", justifyContent: "center" }}><Button
                                buttonStyle={{ backgroundColor: '#93278f' }}
                                titleStyle={{ color: '#fff' }}
                                title="Submit"
                                disabled={loader}
                                containerStyle={{
                                    width: 120,
                                    borderRadius: 10,
                                    marginTop: 3
                                }}
                                onPress={(e) => { handleSubmit(e) }}
                            /></View>}
                        </ScrollView>
                    </>
                    :
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        {/* <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "#93278f", fontSize: responsiveFontSize(2.088), fontWeight: "bold" }}>Comming Soon.........!</Text>
                        </View> */}
                        {formData?.map(({ type, placeholder, label, opt, dependOn, name }: any, i: any) => (
                            dependOn?.depend_val == values[dependOn?.depend_field] &&
                            <View key={i}>
                                {type == "text" ? <Input
                                    placeholder={placeholder}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={errors[name]}
                                    label={label}
                                    labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                    style={style.formGroup}
                                    placeholderTextColor="#0D253C"
                                    key={i}
                                    onFocus={() => setExpanded(expanded && false)}
                                    value={values[name]}
                                    onChangeText={(val) => { handleChange({ name, value: val }), setErrors((pre: any) => ({ ...pre, [name]: val ? "" : `${name?.replace(/_/g, ' ')} is required` })), setExpanded(expanded && false) }}
                                /> : type == "date" ? <>
                                    <TouchableOpacity onPress={() => setOpen(true)}>
                                        <Input
                                            placeholder={placeholder}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={errors[name]}
                                            label={label}
                                            labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                            style={style.formGroup}
                                            placeholderTextColor="#0D253C"
                                            key={i}
                                            disabled={true}
                                            disabledInputStyle={{ color: "#000", opacity: 1 }}
                                            value={values[name]}
                                        />
                                    </TouchableOpacity>
                                    <DatePicker
                                        modal
                                        mode="date"
                                        open={open}
                                        date={values[name] ? moment(values[name], ["DD-MMM-yyyy", "DD-MM-YYYY"]).toDate() : maxDate}
                                        onConfirm={(date) => {
                                            setOpen(false)
                                            handleChange({ name, value: moment(date).format('DD/MMM/YYYY') })
                                        }}
                                        onCancel={() => setOpen(false)}
                                        maximumDate={maxDate}
                                    />
                                </> : <View style={style.selectBox}>
                                    <Text style={style.selectLabel}>{`${label}`}</Text>
                                    <DropDown {...{ data: opt, label, handleChange, name, values, errors, setErrors, checkCate, setExpanded, expanded }} />
                                </View>
                                }

                            </View>

                        ))}
                        {!data?.isPaymentDone && <View style={{ flexDirection: "row", justifyContent: "center" }}><Button
                            buttonStyle={{ backgroundColor: '#93278f' }}
                            titleStyle={{ color: '#fff' }}
                            title="Submit"
                            disabled={loader}
                            containerStyle={{
                                width: 120,
                                borderRadius: 10,
                                marginTop: 3
                            }}
                            onPress={(e) => { handleSubmit(e) }}
                        /></View>}
                    </ScrollView>}
                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => closeModal()}
                >
                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                            <Icon name="check-circle" color="#1c9c52" size={60} style={{ marginRight: 14, marginBottom: 15 }} />
                            <Text style={styles.modalText}>Thank you for updating your form. Your information is now up to date</Text>
                            <TouchableOpacity onPress={() => closeModal()} style={[styles.closeButton, { backgroundColor: "#1c9c52" }]}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: responsiveFontSize(1.74),
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        // backgroundColor: '#1c9c52',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});


export default MyRegistrationForm