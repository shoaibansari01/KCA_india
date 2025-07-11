import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { style } from '../../style/style';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Text } from 'react-native-elements';
import { SliderBox } from "react-native-image-slider-box";
import { s3PreFixUrl } from '../../helper/routes';
import { postReq } from '../../helper/http';
import ImageModal from 'react-native-image-modal';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { ActivityIndicator } from 'react-native-paper';
import { AnimatedIcon } from '../../components/animatedIcon';

const Details = ({ route, navigation }: any) => {
    const { data } = route.params;
    // console.log(data)
    const [registerUserDtls, setRegisterUserDtls]: any = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clickedImagePath, setClickedImagePath] = useState('');
    const [loader, setLoader] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [videoData, setVideoData] = useState([]);

    const getNationalData = async (formId: any) => {
        setLoader(true);
        const res = await postReq({
            url: `get-national-data-by-form-id`, data: { formId }, returnKey: "data"
        });
        if (res) {
            setFileData(res?.reduce((a: any, c: any) => {
                if (['png', 'jpg', 'jpeg'].includes(c?.url.split('.').pop().toLowerCase())) a.push(c)
                return a;
            }, []))
            setVideoData(res?.reduce((a: any, c: any) => {
                if (['mp4', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'webm'].includes(c?.url.split('.').pop().toLowerCase())) a.push(c)
                return a;
            }, []))
            setRegisterUserDtls(res[0]?.formId)
        }
        setLoader(false);
    }

    const handleImagePress = (i: number) => {
        const clickedImagePath: any = fileData[i];
        setClickedImagePath(`${s3PreFixUrl}${clickedImagePath?.url}`);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setClickedImagePath('');
    };

    const handleVideo = (url: any) => navigation.navigate("WebviewScreen", {
        url: url,
    });
    
    useEffect(() => {
        if (data?.formId) getNationalData(data?.formId);
    }, [data?.formId])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20, paddingBottom: 0 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Gallery Details</Text>
                </TouchableOpacity>
            </View>
            {loader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                <ActivityIndicator size="large" color="#93278f" />
            </View> :
                <>
                    <View>
                        {data?.from === "photos" ? <SliderBox
                            autoplay={true}
                            autoplayInterval={5000}
                            circleLoop={true}
                            dotColor="#FFEE58"
                            inactiveDotColor="#90A4AE"
                            ImageComponentStyle={{ width: '90%', height: 200 }}
                            images={fileData?.map((e: any) => `${s3PreFixUrl}${e?.url}`)} onCurrentImagePressed={handleImagePress} /> :
                            <View style={style.gallaryVideoCard}>
                                {!!videoData?.length && videoData?.map((e: any, i) =>
                                    <TouchableOpacity onPress={() => handleVideo(e?.url)}>
                                        <View style={style.gallaryVideoCardItem} key={i}>
                                            <AnimatedIcon name="smart-display" color="#93278f" size={60} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                            // <TouchableOpacity onPress={() => handleVideo(data?.url)}>
                            //     <View style={style.detailsVideoSec}><Icon name="smart-display" color="#93278f" size={100} style={{ marginRight: 14 }} /></View>
                            // </TouchableOpacity>
                        }
                    </View>

                    <View style={style.container}>
                        <View style={style.row}>
                            <Text style={style.detailsHead}>Principal / Art Teacher : </Text>
                            <Text style={[style.detailsValue, { flex: 1, flexWrap: "wrap" }]}>{`${registerUserDtls?.name_of_art_teacher ? `${registerUserDtls?.principal_name ?? ""} / ${registerUserDtls?.name_of_art_teacher},` : ""} ${registerUserDtls?.city ? `${registerUserDtls?.city},` : ""
                                } ${registerUserDtls?.state ? `${registerUserDtls?.state}` : ""}`}</Text>
                        </View>
                    </View>
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={closeModal}
                    >
                        <View style={styles.modalBackground}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Icon name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.card}>
                                <View>
                                    <ImageModal
                                        resizeMode="contain"
                                        imageBackgroundColor="#fff"
                                        style={{
                                            width: 250,
                                            height: 250,
                                        }}
                                        source={{
                                            uri: clickedImagePath,
                                        }}
                                    />
                                </View>
                                {/* <View style={styles.operation}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <View>
                                    {!isLike ? <TouchableOpacity onPress={() => favorite('like')}>
                                        <Icon name={`favorite - border}`} size={30} color="#fff" />
                                    </TouchableOpacity> : <TouchableOpacity onPress={() => favorite("unlike")}>
                                        <Icon name={`favorite`} size={30} color="#fff" />
                                    </TouchableOpacity>}
                                </View>
                                <View>
                                    <TouchableOpacity>
                                        <Icon name="share" color="#fff" size={30} style={{ marginLeft: 10 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> */}
                            </View>
                        </View>
                    </Modal>
                </>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 30,
    },
    card: {
        height: "100%",
        // backgroundColor: "red", 
        flexDirection: "column",
        justifyContent: "center"
        // flex:1
    },
    operation: {
        marginTop: 20
    }
});

export default Details;
