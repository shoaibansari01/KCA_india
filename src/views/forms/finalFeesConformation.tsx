import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native'
import RazorpayCheckout from 'react-native-razorpay';
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { style } from '../../style/style'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { Button, Image } from 'react-native-elements'
import { AuthContext } from '../../helper/contex'
import { RAZORPAY_KEY, postReq } from '../../helper/http';
import { StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { s3PreFixUrl } from '../../helper/routes';
import DocumentPicker from 'react-native-document-picker';

const FinalFeesConformation = ({ route, navigation }: any) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const { authData }: any = useContext(AuthContext);
    const { global, national, level }: any = route.params.data;
    const dollar = global?.values?.country != "IN";
    const [isPaymentComplete, setIsPaymentComplete] = useState({ success: false, err: false });
    const [fileResponse, setFileResponse]: any = useState(null);
    const [fileErr, setFileErr]: any = useState('');

    const artData = global?.artWorkData?.reduce((a: any, c: any) => {
        if (c?.value == global?.artWorkSelected) a = c
        return a;
    }, {})

    const getStudentsInfo: any = ({ clsName, noOfStd }: any) => {
        const fee = national?.classData?.length && national?.classData?.find((e: any) => e?.cls == clsName)?.fees;
        const total = fee * noOfStd;
        return { fee, total }
    }

    const totalFees = () => national?.finalData && Object.keys(national?.finalData)?.reduce((a, c) => {
        a += getStudentsInfo({ clsName: c, noOfStd: national?.finalData[c] }).total
        return a;
    }, 0);

    const studentData = national?.finalData && Object.keys(national?.finalData)?.reduce((a: any, c: any) => {
        a.push({ className: c, no_of_student: national?.finalData[c], fees: getStudentsInfo({ clsName: c, noOfStd: national?.finalData[c] })?.fee, total: getStudentsInfo({ clsName: c, noOfStd: national?.finalData[c] })?.total })
        return a;
    }, [])

    const payment = async () => {
        // handlePaymentModal(true, false); return null
        const _ = await postReq({
            url: "create-order", data: {
                amount: (totalFees() ?? artData?.value) * 100, currency: (dollar && level == "global") ? "USD" : "INR", isNational: (level != "global"), isGlobal: (level == "global"), userId: authData?.user?.userId, form_id: global?.values?._id, noOfArtWork: artData?.numberOfArtWork, studentData
            }
        });
        if (_?.data?.orderRes?.id) {
            const options: any = {
                key: RAZORPAY_KEY,
                currency: _?.data?.orderRes?.currency,
                amount: _?.data?.orderRes?.amount,
                order_id: _?.data?.orderRes?.id,
                name: "KCA",
                description: `${level == "global" ? "Global Participation Form" : "National Participation Form"}`,
                prefill: {
                    email: authData?.user?.email,
                    contact: authData?.user?.mobile_number,
                    name: authData?.user?.name,
                },
                theme: { color: "#93278f" },
            };
            const res = await RazorpayCheckout.open(options)
            if (res?.razorpay_order_id) {
                const status = await postReq({
                    url: "payment-status", data: {
                        id: _?.data?.payment?._id, razorpay_order_id: res?.razorpay_order_id,
                        razorpay_payment_id: res?.razorpay_payment_id,
                        razorpay_signature: res?.razorpay_signature, razorpay_details: res
                    }
                })
                status?.data && handlePaymentModal(true, false)
            }
            !res?.razorpay_order_id && handlePaymentModal(false, true)
        }
    }

    const handlePaymentModal = (success: any, err: any) => {
        setIsPaymentComplete((pre) => ({ ...pre, success, err }));
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = (success: any, err: any, redirect: any = false) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(async () => {
            await setIsPaymentComplete((pre) => ({ ...pre, success, err }));
            // redirect && navigation.navigate(`${level != "global" ? "UploadData" : "UploadArtWork"}`, { data: { values: { ...global?.values, level } } });
            redirect && navigation.navigate("UserDashboard", { data: { values: { ...global?.values }, level } });
        });
    };

    const handleDocumentPicker = async () => {
        try {
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const allowedExtensions = ['png', 'jpg', 'jpeg'];
            if (allowedExtensions.includes(res[0]?.name?.split('.').pop())) {
                setFileResponse(res);
                setFileErr('');
            } else {
                setFileResponse(null);
                Alert.alert('Invalid File', 'Please select an .png,.jpeg,.png file.');
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.warn('Canceled from document picker');
            } else {
                console.warn('Unknown error: ', err);
                throw err;
            }
        }
    };

    const uploadPaymentReceipt = async () => {
        if (!fileResponse?.[0]?.name) return setFileErr("Payment receipt is required");
        
        const formData = new FormData();
        formData.append('files', {
            uri: fileResponse[0].uri,
            type: fileResponse[0].type,
            name: fileResponse[0].name,
        });
        formData.append('data', JSON.stringify({ 
            userId: authData?.user?.userId, 
            formId: global?.values?._id,
            level: level,
            amount: totalFees() ?? artData?.value
        }));

        try {
            const uploadResult = await postReq({
                url: `upload-payment-receipt`, 
                data: formData
            });
            if (uploadResult?.data) {
                handlePaymentModal(true, false);
            }
        } catch (error) {
            Alert.alert('Upload Failed', 'Failed to upload payment receipt. Please try again.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Total Fees To Pay</Text>
                </TouchableOpacity>
                <View style={style.confirmEntrySec}>
                    <ScrollView>
                        <View style={style.finalFeeConfCard}>
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text style={style.confirmEntryCardDetails}>Total {level != "global" ? "Participant" : "Art Work"}</Text>
                                    <Text style={style.confirmEntryCardDetails}>Total</Text>
                                </View>
                                <View style={style.horizontalLine} />
                            </View>
                            {level != "global" ? <View style={{ marginVertical: 20 }}>
                                {Object.keys(national?.finalData)?.map((e, i) =>
                                    <View key={i}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Text style={style.confirmEntryCardDetails}>{e} X {national?.finalData[e]}</Text>
                                            <Text style={style.confirmEntryCardDetails}>{`${national?.symbol}  ${getStudentsInfo({ clsName: e, noOfStd: national?.finalData[e] })?.total}`}</Text>
                                        </View>
                                        <View style={style.dividerfinalFees} />
                                    </View>
                                )}
                            </View> : <View style={{ marginVertical: 20 }}>
                                <View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                        <Text style={style.confirmEntryCardDetails}>{artData?.label}</Text>
                                        <Text style={style.confirmEntryCardDetails}>{artData?.value}</Text>
                                    </View>
                                    <View style={style.dividerfinalFees} />
                                </View>
                            </View>}
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text style={style.confirmEntryCardDetails}></Text>
                                    <Text style={style.totalFinalFees}>{global?.symbol} {totalFees()?.toFixed(2) ?? artData?.value}</Text>
                                </View>
                            </View>
                            <View style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                <Image source={{ uri: `${s3PreFixUrl}kcaCred/KcaQR.jpeg` }} style={{ width: 250, height: 300 }} />
                                <Text style={style.confirmEntryCardDetails}>Pay participation fees via KCA QR code or GPay using KCA number: 7770016545. Send screenshot of payment confirmation to the same number.</Text>
                                
                                <View style={{ marginHorizontal: 0, marginTop: 20 }}>
                                    <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: responsiveFontSize(1.8), color: "#93278f", textAlign: "center", marginBottom: 10 }}>Upload your payment receipt.</Text>
                                    <TouchableOpacity style={[style.uploaddatadashBorder, { padding: 10 }]} onPress={handleDocumentPicker}>
                                        <Text style={style.uploaddataDragDrop}>Browse Files</Text>
                                    </TouchableOpacity>
                                    {!!fileErr?.length && <Text style={[style.errorText, { fontSize: responsiveFontSize(1.6) }]}>{fileErr}</Text>}
                                    {fileResponse?.[0]?.name && <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 10 }}>
                                        <Icon name="file-present" color="#18701f" size={25} style={{ marginRight: 14 }} />
                                        <Text style={{ fontSize: responsiveFontSize(1.74), fontWeight: "bold" }}>{fileResponse?.[0]?.name.slice(0, 30)}</Text>
                                    </View>}
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
                                    <Button
                                        buttonStyle={{ backgroundColor: '#93278f' }}
                                        titleStyle={{ color: '#fff' }}
                                        title="Submit Receipt"
                                        onPress={uploadPaymentReceipt}
                                        containerStyle={{
                                            width: 150,
                                            borderRadius: 10,
                                            marginVertical: 30
                                        }}
                                    />
                                </View>
                                
                                {/* 
                                <Button
                                    buttonStyle={{ backgroundColor: '#93278f' }}
                                    titleStyle={{ color: '#fff' }}
                                    title="Pay Now"
                                    // onPress={payment}
                                    containerStyle={{
                                        width: 120,
                                        borderRadius: 10,
                                        marginVertical: 30
                                    }}
                                /> */}
                            </View>
                            {/* <View style={{ marginStart: "auto" }}><Button
                                buttonStyle={{ backgroundColor: '#93278f' }}
                                titleStyle={{ color: '#fff' }}
                                title="Pay Now"
                                onPress={payment}
                                containerStyle={{
                                    width: 120,
                                    borderRadius: 10,
                                    marginVertical: 30
                                }}
                            /></View> */}
                        </View>
                    </ScrollView>
                </View>

                <Modal
                    visible={isPaymentComplete?.success}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => closeModal(false, false, true)}
                >
                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                            <Icon name="check-circle" color="#1c9c52" size={60} style={{ marginRight: 14, marginBottom: 15 }} />
                            <Text style={styles.modalText}>We are delighted to inform you that we received your payment</Text>
                            <TouchableOpacity onPress={() => closeModal(false, false, true)} style={[styles.closeButton, { backgroundColor: "#1c9c52" }]}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>

                <Modal
                    visible={isPaymentComplete?.err}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => closeModal(false, false)}
                >
                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                            <Icon name="error" color="#b82c39" size={60} style={{ marginRight: 14, marginBottom: 15 }} />
                            <Text style={styles.modalText}>Unfortunately, we have an issue with your payment. Try again later.</Text>
                            <TouchableOpacity onPress={() => closeModal(false, false)} style={[styles.closeButton, { backgroundColor: "#b82c39" }]}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

export default FinalFeesConformation


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginEnd: 5,
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
    disabledButtonText: {
        color: '#a9a9a9',
    },
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
