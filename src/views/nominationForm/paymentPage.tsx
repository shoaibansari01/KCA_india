import React, { useContext, useState } from 'react'
import { SafeAreaView, TouchableOpacity, View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Image, Text } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { style } from '../../style/style';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { postReq } from '../../helper/http';
import { AuthContext } from '../../helper/contex';
import { littleLegs } from '../../helper/reusableFun';
import qrCode from '../../assets/images/KcaQR.jpeg';
import { notReq } from './nominiForm';
import { s3PreFixUrl } from '../../helper/routes';
import DocumentPicker from 'react-native-document-picker';



const NominiPaymentSection = ({ navigation, route }: any) => {
    const { authData }: any = useContext(AuthContext);
    const { values, fileData }: any = route?.params?.data;
    const [loader, setLoader] = useState(false);
    const [fileResponse, setFileResponse]: any = useState(null);
    const [fileErr, setFileErr]: any = useState('');
    const selectedCategory = notReq.reduce((a: any, c: any) => {
        if (values?.[c]) a.push({ 'category': c, 'price': 150 })
        return a;
    }, []);

    const submit = async (e: any) => {
        e.preventDefault();
        if (!fileResponse?.[0]?.name) return setFileErr("File is Required");
        setLoader(true);
        const res = await postReq({
            url: "nomini-registration", data: { ...values, userId: authData?.user?.userId }
        });
        if (res && res?.authdata) {
            const filesDataArr: any = Object.values(fileData).reduce((a: any, c: any) => {
                a.push(c[0])
                return a;
            }, []);
            const dataForUpload = [...fileResponse, ...filesDataArr]
            const formData = new FormData();
            dataForUpload.forEach((file: any) => {
                formData.append('files', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                });
            });
            formData.append('data', JSON.stringify({ userId: authData?.user?.userId, _id: res?.authdata?._id }))
            const _ = await postReq({
                url: `upload-nomini-data/nominiData`, data: formData
            });
            if (_.data) {
                littleLegs(150);
                navigation.navigate('HomeScreen');
            }
        }
        setLoader(false);
    }
    const handleDocumentPicker = async () => {
        try {
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const allowedExtensions = ['png', 'jpg', 'jpeg'];
            if (allowedExtensions.includes(res[0]?.name?.split('.').pop())) {
                setFileResponse(res);
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14, fontWeight: "bold" }} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: responsiveFontSize(2.5), textAlign: "center", color: "#001B47", fontWeight: "bold", marginBottom: 10 }}>Total Fees To Pay</Text>
                    <View style={{ height: responsiveHeight(80) }}>
                        <ScrollView>
                            <ScrollView>
                                <View style={style.finalFeeConfCard}>
                                    <View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Text style={[style.confirmEntryCardDetails, { color: "#93278f" }]}>Selected Category</Text>
                                            <Text style={[style.confirmEntryCardDetails, { color: "#93278f" }]}>Price</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 20 }}>
                                        {!!selectedCategory?.length && selectedCategory?.map((e: any, i: any) =>
                                            <View>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                                    <Text style={style.confirmEntryCardDetails}>{`${e?.category.charAt(0).toUpperCase()}${e?.category?.slice(1)}`?.replace("_", " ")}</Text>
                                                    <Text style={style.confirmEntryCardDetails}>{e?.price}</Text>
                                                </View>
                                                <View style={style.dividerfinalFees} />
                                            </View>
                                        )}
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Text style={style.confirmEntryCardDetails}>Total</Text>
                                            <Text style={style.totalFinalFees}>{150 * selectedCategory?.length}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{ fontWeight: "bold", marginVertical: 10, fontSize: responsiveFontSize(2.5), color: "#93278f" }}>SCAN TO PAY</Text>
                                        <Image source={{ uri: `${s3PreFixUrl}kcaCred/KcaQR.jpeg` }} style={{ width: 250, height: 300 }} />
                                        <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: responsiveFontSize(1.8), color: "#93278f" }}>GPay/PhonePe : <Text style={{ fontWeight: "bold" }}>7770016545</Text></Text>
                                        {/* <View style={{ marginVertical: 10 }}>
                                            <Text style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>Note : <Text> Pay and send screenshot of transaction at 7770016545</Text></Text>
                                        </View> */}
                                    </View>

                                    <View style={{ marginHorizontal: 0 }}>
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

                                    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}><Button
                                        buttonStyle={{ backgroundColor: '#93278f' }}
                                        titleStyle={{ color: '#fff' }}
                                        title="Submit"
                                        onPress={(e) => { submit(e) }}
                                        disabled={loader}
                                        containerStyle={{
                                            width: 120,
                                            borderRadius: 10,
                                            marginVertical: 30
                                        }}
                                    /></View>
                                </View>
                            </ScrollView>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#001B47'
    },
    bold: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold',
        color: '#93278f'
    },
    subText: {
        fontWeight: 'bold',
        color: '#93278f'
    },
    paymentRecipt: {
        fontWeight: "bold", marginTop: 10, fontSize: responsiveFontSize(1.8), color: "#93278f", textAlign: "center", marginBottom: 10
    }
});


export default NominiPaymentSection
