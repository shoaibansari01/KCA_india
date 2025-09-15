import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Button, ActivityIndicator, Modal, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import DocumentPicker from 'react-native-document-picker';
import { style } from '../../style/style'
import { Input } from 'react-native-elements';
import { fileDownloader, postReq } from '../../helper/http';
import { Alert } from 'react-native';
import { Animated } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const UploadData = ({ navigation, route }: any) => {
    const { data, title, name } = route.params;
    const [fadeAnim] = useState(new Animated.Value(0));
    const [fileResponse, setFileResponse]: any = useState(null);
    const [loader, setLoader] = useState(false);
    const [schoolName, setSchoolName] = useState("");
    const [error, setError] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);

    const handleSchoolName = (val: any, name: any) => setSchoolName(val);

    const handleDocumentPicker = async () => {
        try {
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res[0]?.name.endsWith('.xlsx') || res[0]?.name.endsWith('.xls')) {
                setFileResponse(res);
            } else {
                setFileResponse(null);
                Alert.alert('Invalid File', 'Please select an .xlsx or .xls file.');
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

    const uploadFile = async () => {
        // setFormSubmit(true);
        if (!schoolName?.length) {
            setError('School name can\'t be empty');
            return;
        }
        setLoader(true);
        if (!fileResponse) return;
        const formData = new FormData();
        formData.append('file', {
            uri: fileResponse[0].uri,
            type: fileResponse[0].type,
            name: fileResponse[0].name,
        });
        formData.append('data', JSON.stringify({ ...data?.values, upload_type: "form", school_name: schoolName }))
        try {
            const res = await postReq({
                url: `upload-student-data/studentUpload`, data: formData
            });
            if (res) {
                setLoader(false);
                setSchoolName('');
                setError('');
                setFileResponse(null);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error uploading file', error);
            setLoader(false);
        }
        // setFormSubmit(false);
        // await handlePaymentModal();
    };


    const handlePaymentModal = () => {
        setFormSubmit(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(async () => {
            setFormSubmit(false);
        });
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Student Upload Data</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View>
                        <Text style={style.uploaddataHead}>Upload Data Here  (Name Of The Participants Class wise)</Text>
                    </View>
                    <View>
                        <Text style={style.uploaddataSubHead}>School Name</Text>
                        <View style={style.uploaddatadashBorder}>
                            <TextInput
                                placeholder="Enter Your School Name"
                                style={{ padding: 10 }}
                                placeholderTextColor="#0D253C"
                                value={schoolName}
                                underlineColorAndroid="transparent"
                                onChangeText={val => handleSchoolName(val, 'school_name')}
                            />
                        </View>
                        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={style.uploaddataSubHead}>Upload File</Text>
                        <TouchableOpacity style={[style.uploaddatadashBorder, { padding: 20 }]} onPress={handleDocumentPicker}>
                            <Text style={style.uploaddataDragDrop}>Browse Files</Text>
                        </TouchableOpacity>
                        {fileResponse?.[0]?.name && <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 10 }}>
                            <Icon name="file-present" color="#18701f" size={25} style={{ marginRight: 14 }} />
                            <Text style={{ fontSize: responsiveFontSize(1.74), fontWeight: "bold" }}>{fileResponse?.[0]?.name}</Text>
                        </View>}

                        {fileResponse?.[0]?.name && <TouchableOpacity style={{ marginTop: 20 }} onPress={uploadFile} disabled={loader}>
                            <View style={style.submitButton}>
                                <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Upload File</Text>
                                {loader && <ActivityIndicator color="#fff" />}
                            </View>
                        </TouchableOpacity>}

                        <Text onPress={() => {
                            return fileDownloader('StudentDataTemplete/KCA_Sample_Templete.xlsx');
                        }} style={style.anchorLinkAccent}>Download excell sheet to mention Participants name,class and school name. </Text>
                    </View>

                </ScrollView>

                {/* <Modal
                    visible={formSubmit}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setFormSubmit(false)}
                >
                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                            <Icon name="check-circle" color="#1c9c52" size={60} style={{ marginRight: 14, marginBottom: 15 }} />
                            <Text style={styles.modalText}>we are delighted to inform you that we received your payment</Text>
                            <TouchableOpacity onPress={closeModal} style={[styles.closeButton, { backgroundColor: "#1c9c52" }]}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal> */}

            </View>
        </SafeAreaView>
    )
}

export default UploadData

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
