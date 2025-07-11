import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Animated } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import formImg from '../../assets/images/partcipentFormImg.png';
import { style } from '../../style/style'
import TermAndCond from '../../components/termAndCond';
import DocumentPicker from 'react-native-document-picker';
import { UPLOAD_DATA, postReq } from '../../helper/http';
import { s3PreFixUrl } from '../../helper/routes';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { AuthContext } from '../../helper/contex';
import { AnimatedIcon } from '../../components/animatedIcon';


const termAndCon: any = { head: { mainHead: "Upload Photos" }, body: [{ head: "First Step", content: "Photos and videos can be uploaded during the first step while conducting the competition at your own respective school to document the event." }, { head: "Second Step", content: "Then, during the second step at the prize distribution ceremony in your school, additional photos and videos can be uploaded to capture the moment of awarding prizes. This ensures comprehensive coverage of both the competition and the prize distribution ceremony." }, { head: "Photos", content: "The uploaded photos and videos will be visible in the gallery." }] };

const UploadPhotos = ({ navigation, route }: any) => {
    const { authData }: any = useContext(AuthContext);
    const { data, title, name } = route.params;
    const [fileResponse, setFileResponse]: any = useState([]);
    const [loader, setLoader] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [artWorkLoader, setArtWorkLoader] = useState(false);
    const [artWorkData, setArtWorkData]: any = useState([]);
    const [uploadedArtWork, setUploadedArtWork]: any = useState([]);
    const scaleValue = useRef(new Animated.Value(0)).current;
    const [preUploadedArtWorkLength, setPreUploadedArtWorkLength]: any = useState(0);

    const getArtWorkSelected = async () => {
        setArtWorkLoader(true);
        const res = await postReq({
            url: "get-artwork/isNational", data: {
                userId: authData?.user?.userId, form_id: data?.values?._id
            }, returnKey: "data"
        });
        if (res) {
            setArtWorkData(res)
            setUploadedArtWork(res?.form_id?.uploads?.reduce((a: any, c: any) => {
                if (!c?.isInactive) a.push(c)
                return a;
            }, []) ?? [] ?? [])
            setPreUploadedArtWorkLength(res?.form_id?.uploads?.filter((e: any) => !e?.isInactive)?.length)
        }
        setArtWorkLoader(false);
    }

    const handleDocumentPicker = async () => {
        try {
            setExpanded(expanded && false);
            const allowedExtensions = ['png', 'jpg', 'jpeg', "mp4"];
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (!allowedExtensions.includes(res[0]?.name?.split('.').pop())) {
                Alert.alert(
                    'Invalid File Format',
                    'Please select a valid file format (e.g., images, videos).'
                );
                return null
            }
            setFileResponse((pre: any) => {
                const newFiles = res.map((f: any) => ({
                    ...f,
                    idx: Math.floor(100 + Math.random() * 900),
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

    const removeFile = (i: any) => {
        setExpanded(expanded && false);
        setFileResponse((pre: any) => pre.filter((_: any) => _?.idx != i?.idx));
    }

    const uploadFile = async () => {
        setLoader(true);
        if (!fileResponse) return;
        const formData = new FormData();
        fileResponse.forEach((file: any) => {
            formData.append('files', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });
        });
        formData.append('data', JSON.stringify({ ...data?.values, previousSelectArt: uploadedArtWork, upload_type: "media", artWorkData }))
        try {
            const res = await postReq({
                url: `upload-data/nationalData`, data: formData
            });
            if (res) {
                setFileResponse([]);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error uploading file', error);
        }
        setLoader(false);
    };

    const removePreArtWork = (e: any) => {
        setUploadedArtWork(uploadedArtWork.filter((pre: any) => pre?._id != e?._id))
    }

    const handleVideo = (url: any) => navigation.navigate("WebviewScreen", {
        url: url,
    });

    Animated.spring(scaleValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
    }).start();
    useEffect(() => {

    }, []);

    useEffect(() => {
        getArtWorkSelected()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>{name ?? ""}</Text>
                </TouchableOpacity>
                {UPLOAD_DATA ? <ScrollView>
                    {artWorkLoader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                        <ActivityIndicator size="large" color="#93278f" />
                    </View> :
                        <>
                            <View style={style.brochureInfo}>
                                <Image style={[style.participentformImg, { height: 200, objectFit: "fill" }]} source={{ uri: `${s3PreFixUrl}homepage/national.jpg` }} />
                                <TermAndCond {...{ data: termAndCon, expanded, setExpanded }} />
                            </View>
                            <TouchableOpacity style={[style.uploaddatadashBorder, { padding: 20 }]} onPress={handleDocumentPicker}>
                                <Text style={style.uploaddataDragDrop}>Browse Files</Text>
                            </TouchableOpacity>

                            <View style={{ marginTop: 10 }}>
                                {!!fileResponse?.length && (
                                    <View style={{ paddingTop: 10 }}>
                                        {fileResponse?.map((file: any, i: any) => (
                                            <View key={i} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 10 }}>
                                                <Icon name="file-present" color="#18701f" size={25} style={{ marginRight: 14 }} />
                                                <Text style={{ fontSize: responsiveFontSize(1.74), fontWeight: "bold" }}>{file?.name?.slice(0, 35)}</Text>
                                                <TouchableOpacity onPress={() => removeFile(file)} style={{ marginLeft: 10 }}>
                                                    <Icon name="close" color="#d9534f" size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                            {!!uploadedArtWork?.length &&
                                <View style={{ width: '100%', paddingHorizontal: 10, margin: 0 }}>
                                    <Text style={style.preChosenArtWorkText}>Previously Chosen</Text>
                                    <View style={style.gallaryCard}>
                                        {uploadedArtWork?.map((e: any, i: any) =>
                                            <>
                                                <View style={[style.gallaryCard.item, { position: "relative", flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }]} key={i}>
                                                    {!!['png', 'jpg', 'jpeg',].includes(e?.url.split('.').pop()) ? <Image source={{ uri: `${s3PreFixUrl}${e?.url}` }} style={{ width: "100%", height: 120, borderRadius: 7 }} /> : <View style={style.videoInUplod}>
                                                        <TouchableOpacity onPress={() => handleVideo(e?.url)}>
                                                            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                                                                <AnimatedIcon name="smart-display" color="#93278f" size={70} />
                                                            </Animated.View>
                                                        </TouchableOpacity>
                                                    </View>}
                                                    <TouchableOpacity onPress={() => removePreArtWork(e)} style={{ marginLeft: 10, position: "absolute", right: -8, top: -10 }}>
                                                        <Icon name="close" color="#d9534f" size={24} />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </View>

                                </View>
                            }

                            {(!!fileResponse?.length || (uploadedArtWork?.length != preUploadedArtWorkLength)) && <TouchableOpacity style={{ marginTop: 20 }} onPress={uploadFile} disabled={loader}>
                                <View style={style.submitButton}>
                                    <Text style={{ color: "#fff", fontWeight: "bold", marginEnd: loader ? 5 : 0 }}>Upload</Text>
                                    {loader && <ActivityIndicator color="#fff" />}
                                </View>
                            </TouchableOpacity>}
                        </>
                    }

                </ScrollView> :
                    <View style={{ flexDirection: "row", height: responsiveHeight(80), justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#93278f", textAlign: "center" }}>Upload competition photos from Nov onwards - Principals/Art Teachers/Admins only</Text>
                    </View>}

            </View>
        </SafeAreaView>
    )
}

export default UploadPhotos