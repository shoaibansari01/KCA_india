import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, TextInput, Animated } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { style } from '../../style/style'
import DocumentPicker from 'react-native-document-picker';
import { postReq } from '../../helper/http';
import { AuthContext } from '../../helper/contex';
import { s3PreFixUrl } from '../../helper/routes'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import moment from 'moment'
import { BlinkingTextTwo } from '../../components/BlinkingText'

const UploadArtWork = ({ navigation, route }: any) => {
    const opacity = useRef(new Animated.Value(1)).current;
    const { authData }: any = useContext(AuthContext);
    const { data, title, name } = route.params;
    const [fileResponse, setFileResponse]: any = useState([]);
    const [loader, setLoader] = useState(false);
    const [artWorkLoader, setArtWorkLoader] = useState(false);
    const [artWorkData, setArtWorkData]: any = useState({});
    const [uploadedArtWork, setUploadedArtWork]: any = useState([]);
    const [preUploadedArtWorkLength, setPreUploadedArtWorkLength]: any = useState(0);
    const [values, setValues]: any = useState({});
    const [error, setError]: any = useState({});
    const [disableUpload, setDisableUpload] = useState(false);

    const getArtWorkSelected = async () => {
        setArtWorkLoader(true);
        const res = await postReq({
            url: "get-artwork/isGlobal", data: {
                userId: authData?.user?.userId, form_id: data?.values?._id
            }, returnKey: "data"
        });
        res && setArtWorkData(res)
        if (res?.form_id?.uploads?.length) {
            let oldestArtWork = res?.form_id?.uploads[0];
            for (let i = 1; i < res?.form_id?.uploads.length; i++) {
                if (new Date(res?.form_id?.uploads[i].createdAt) < new Date(oldestArtWork.createdAt)) {
                    oldestArtWork = res?.form_id?.uploads[i];
                }
            }
            const time72HoursAgo = moment().subtract(72, 'hours');
            if (moment(oldestArtWork.createdAt).isBefore(time72HoursAgo)) setDisableUpload(true);
            setUploadedArtWork(res?.form_id?.uploads?.reduce((a: any, c: any) => {
                if (!c?.isInactive) a.push(c)
                return a;
            }, []) ?? [])
            setPreUploadedArtWorkLength(res?.form_id?.uploads?.filter((e: any) => !e?.isInactive)?.length)
        }
        setArtWorkLoader(false);
    }

    const handleDocumentPicker = async () => {
        try {
            const maxFileSize = 10000000
            const allowedExtensions = ['png', 'jpg', 'jpeg'];
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if ((fileResponse?.length + 1) > (artWorkData?.art_Work_select - uploadedArtWork?.length)) {
                Alert.alert(
                    'File Limit Exceeded',
                    `You selected ${artWorkData?.art_Work_select} artwork for the participation form. To choose additional artworks, please register individually for the Global Art Exhibition.`
                );
                return null
            }
            if (!allowedExtensions.includes(res[0]?.name?.split('.').pop())) {
                Alert.alert(
                    'Invalid File Format',
                    'Please select files with PNG or JPEG extensions.'
                );
                return null
            }
            if (res[0]?.size > maxFileSize) {
                Alert.alert(
                    'File Size Exceeded',
                    'Please select files smaller than 10 MB.'
                );
                return null
            }
            const randNo = Math.floor(100 + Math.random() * 900);
            setValues((pre: any) => ({ ...pre, [randNo]: "" }))
            setFileResponse((pre: any) => {
                const newFiles = res.map((f: any) => ({
                    ...f,
                    idx: randNo,
                    price: 100
                }));
                const combinedFiles = [...pre, ...newFiles];
                return combinedFiles;
            });

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.warn('Canceled from document picker');
            } else {
                console.warn('Unknown error: ', err);
                throw err;
            }
        }
    };

    const removeFile = (file: any) => {
        const newVal = { ...values };
        delete newVal[file?.idx];
        setValues(newVal);
        setFileResponse((pre: any) => pre.filter((_: any) => _?.idx != file?.idx));
    }

    const removePreArtWork = (e: any) => {
        setUploadedArtWork(uploadedArtWork.filter((pre: any) => pre?._id != e?._id))
    }

    const uploadFile = async () => {
        let error: any = {};
        Object.keys(values).map(each => (!values?.[each] && (error[each] = "Art work amount is Required")));
        setLoader(true);
        setError(error)
        if (!Object.keys(error)?.length) {
            if (!fileResponse) return;
            const formData = new FormData();
            fileResponse.forEach((file: any) => {
                formData.append('files', {
                    uri: file.uri,
                    type: file.type,
                    name: `${file.idx}-${file.name}`
                });
            });
            formData.append('data', JSON.stringify({ ...data?.values, previousSelectArt: uploadedArtWork, upload_type: "media", artWorkData, artWorkPrice: values }))
            try {
                const res = await postReq({
                    url: `upload-data/globalData`, data: formData
                });
                if (res) {
                    setFileResponse([]);
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error uploading file', error);
            }
        }
        setLoader(false);
    };

    const handlePrice = (value: any, file: any) => {
        setValues((pre: any) => ({ ...pre, [file?.idx]: value }))
    }

    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        );
        blink.start();
        return () => blink.stop();
    }, [opacity]);

    useEffect(() => {
        setArtWorkData({});
        getArtWorkSelected();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>{name ?? ""}</Text>
                </TouchableOpacity>
                <ScrollView>

                    {artWorkLoader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                        <ActivityIndicator size="large" color="#93278f" />
                    </View> : !!artWorkData?.art_Work_select ? <>

                        <View style={style.brochureInfo}>
                            <Image style={[style.participentformImg, { height: 200, objectFit: "fill" }]} source={{ uri: `${s3PreFixUrl}homepage/global.png` }} />
                        </View>
                        <View>
                            <Text style={style.uploaddataHead}>Upload Your Art Work Here ( Upto 10MB ) 300 Resolutions.</Text>
                            {!!artWorkData?.form_id?.uploads?.length && <View style={{ marginBottom: 8 }}>
                                <BlinkingTextTwo>
                                    After submitting your participation fees, you can edit your selected artworks within 72 hours.
                                    To add more artworks, click on individual registration on the Global Art Exhibition homepage, re-participate,
                                    and select additional artworks.
                                </BlinkingTextTwo>
                            </View>}
                        </View>
                        <TouchableOpacity style={[style.uploaddatadashBorder, { padding: 20 }]} onPress={() => !disableUpload && handleDocumentPicker()}>
                            <Text style={style.uploaddataDragDrop}>Browse Files</Text>
                        </TouchableOpacity>
                    </> :
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', height: responsiveHeight(80) }}>
                            <Text style={{ fontSize: responsiveFontSize(2.32), fontWeight: 'bold', textAlign: 'center', color: '#93278f' }}>
                                You must fill out the participation form before uploading your artwork.
                            </Text>
                        </View>}

                    <View style={{ marginTop: 10 }}>
                        {!!fileResponse?.length && (
                            <View style={{ paddingTop: 10 }}>
                                {fileResponse?.map((file: any, i: any) => (
                                    <>
                                        <View key={i} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 10 }}>
                                            <Icon name="file-present" color="#18701f" size={25} style={{ marginRight: 14 }} />
                                            <Text style={{ fontSize: responsiveFontSize(1.74), fontWeight: "bold" }}>{file.name.slice(0, 30)}</Text>
                                            <TouchableOpacity onPress={() => removeFile(file)} style={{ marginLeft: 10 }}>
                                                <Icon name="close" color="#d9534f" size={20} />
                                            </TouchableOpacity>
                                        </View>
                                        <TextInput
                                            placeholder={`Add the Selling Price of your artwork in ${artWorkData?.form_id?.country != "IN" ? "$" : "₹"}`}
                                            style={{
                                                height: responsiveHeight(4),
                                                width: responsiveWidth(72),
                                                borderColor: '#93278f',
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                marginTop: 3,
                                                marginBottom: error[file.idx] ? 0 : 10,
                                                paddingHorizontal: 10,
                                                fontSize: 12,
                                                backgroundColor: "#fff"
                                            }}
                                            maxLength={6}
                                            keyboardType="numeric"
                                            value={values[file?.idx]}
                                            onChangeText={(text: any) => {
                                                handlePrice(text, file)
                                            }}
                                        />
                                        {error[file.idx] && <Text style={style.errorText}>{error[file.idx]}</Text>}
                                    </>

                                ))}
                            </View>
                        )}
                    </View>

                    {!!uploadedArtWork?.length &&
                        <View style={{ width: '100%', paddingHorizontal: 10, margin: 0 }}>
                            <Text style={style.preChosenArtWorkText}>Previously Chosen Art</Text>

                            <View style={style.gallaryCard}>
                                {uploadedArtWork?.map((e: any, i: any) =>
                                    <>
                                        <View style={[style.gallaryCard.item, { position: "relative", paddingBottom: 0 }]} key={i}>
                                            <TouchableOpacity onPress={() => navigation.navigate(`SingleExhibationImageScreen`, { data: { userId: artWorkData?.user_id?.id, ...e, pictureID: e?._id } })}>
                                                <Image source={{ uri: `${s3PreFixUrl}${e?.url}` }} style={{ width: "100%", height: 120, borderRadius: 7 }} />
                                            </TouchableOpacity>
                                            <Text style={{ margin: 0, padding: 5, color: "#d31a2a", textAlign: "right", fontWeight: "bold" }}>{artWorkData?.form_id?.country != "IN" ? "$" : "₹"} {e?.price ?? ""}</Text>
                                            <TouchableOpacity onPress={() => !disableUpload && removePreArtWork(e)} style={{ marginLeft: 10, position: "absolute", right: -8, top: -10 }}>
                                                <Icon name="close" color="#d9534f" size={24} />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>

                        </View>
                    }

                    {(!!fileResponse?.length || (uploadedArtWork?.length != preUploadedArtWorkLength)) && <TouchableOpacity style={{ marginTop: 20 }} onPress={uploadFile} disabled={loader || disableUpload}>
                        <View style={style.submitButton}>
                            <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Upload</Text>
                            {loader && <ActivityIndicator color="#fff" />}
                        </View>
                    </TouchableOpacity>}


                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default UploadArtWork