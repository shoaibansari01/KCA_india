import { View, Text, SafeAreaView, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, TextInput, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { style } from '../../style/style';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { postReq } from '../../helper/http';
import { SliderBox } from "react-native-image-slider-box";
import { s3PreFixUrl } from '../../helper/routes';
import { countryArr, littleLegs } from '../../helper/reusableFun';
import ImageModal from 'react-native-image-modal';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Input } from 'react-native-elements';
import { AuthContext } from '../../helper/contex';
import { ScrollView } from 'react-native-gesture-handler';

const _data: any = { collegeStud: "College Student", schoolStud: "School student", professionalArtists: "Professional Artist" };

const SingleExhibationImageScreen = ({ route, navigation }: any) => {
    const { data } = route.params;
    const { authData }: any = useContext(AuthContext);
    const [artWorkData, setArtWorkData]: any = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cmntModal, setCmntModal] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [likeImgArr, setLikeImgArr]: any = useState([]);
    const [exhibitionData, setExhibitionData]: any = useState([]);
    const [loader, setLoader] = useState(false);
    const [likeLoader, setLikeLoader] = useState(false);
    const [cmntLoader, setCmntLoader] = useState(false);
    const [comment, setComment] = useState('');
    const [distCmnt, setDistCmnt] = useState([]);
    const [allCmnt, setAllCmnt] = useState([]);
    const [perticularUserCmnt, setPerticularUserCmnt]: any = useState([]);
    const [imgId, setImgId] = useState("");
    const [likeCount, setImgLikeCount]: any = useState();
    const [blockUserLoader, setBlockUserLoader] = useState(false);
    const [updatedCmntLoader, setUpdatedCmntLoader] = useState(false);

    const getProfileData = async (id: any) => {
        setLoader(true);
        const res = await postReq({
            url: `get-artwork-by-id`, data: { profileId: id }, returnKey: "data"
        });
        if (res) {
            setImgId(res?._id);
            setArtWorkData(res);
        }
        await getCurIMgLikeCount(id);
        await getComment(id);
        await getLikes(res?.formId?.userId?.id, res?.formId?._id);
        setLoader(false);
    }

    const getCurIMgLikeCount = async (imgId: any) => {
        const res = await postReq({
            url: `get-perticular-img-likes`, data: { imgId }, returnKey: "data"
        });
        res && setImgLikeCount(res?.likeCounts ?? 0)
    }

    const getLikes = async (userId: any, formId: any) => {
        const res = await postReq({
            url: `get-likes`, data: { userId, formId }, returnKey: "data"
        });
        res && setLikeImgArr(res?.reduce((a: any, c: any) => {
            a.push(c?.pictureId)
            return a;
        }, []));

    }

    const closeModal = () => setIsModalVisible(false);

    const favorite = async (op: any, imgPath: any) => {
        setLikeLoader(true);
        if (op == "like") {
            setImgLikeCount(likeCount + 1);
            setLikeImgArr((pre: any) => ([...pre, imgPath]));
        }
        if (op != "like") {
            setImgLikeCount(likeCount - 1);
            setLikeImgArr((pre: any) => pre?.filter((e: any) => e != imgPath));
        }
        const res = await postReq({
            url: `like-img/${op}`, data: { formId: artWorkData?.formId?._id, userId: artWorkData?.formId?.userId?.id, pictureId: imgPath }, returnKey: "data"
        });
        await getCurIMgLikeCount(imgPath)
        getLikes(artWorkData?.formId?.userId?.id, artWorkData?.formId?._id);
        setLikeLoader(false)
    }

    const handleComment = (val: any, name: any) => setComment(val);

    const submit = async (comment: any, data: any) => {
        setCmntLoader(true);
        const res = await postReq({
            url: `comment`, data: { comment, picture_id: data?.pictureId?._id, formId: data?.formId?._id, userId: data?.userId?.id, isOwner: true }, returnKey: "data"
        });
        await getCmntByUser(data?.pictureId?._id, data?.userId?.id);
        setComment('');
        setCmntLoader(false)
        await getComment(data?.pictureId?._id);
    }

    const getCmntByUser = async (pictureId: any, userId: any) => {
        const res = await postReq({
            url: `get-comment`, data: { picture_id: pictureId, userId: userId, sort: false }, returnKey: "data"
        });
        setPerticularUserCmnt(res);
    }

    const blockUser = async (type: any, profileId: any, userId: any) => {
        setBlockUserLoader(true);
        const res = await postReq({
            url: `comment-permission/${type}`, data: { profileId, userId }, returnKey: "data"
        });
        setCmntModal(false);
        setBlockUserLoader(false);
        setUpdatedCmntLoader(true);
        await getComment(profileId);
        setUpdatedCmntLoader(false);
    }

    const getComment = async (id: any) => {
        const res = await postReq({
            url: `get-all-comment`, data: { pictureId: id }, returnKey: "data"
        });
        if (res) {
            setAllCmnt(res);
            const data = res?.reduce((a: any, c: any) => {
                if (!a.some((obj: any) => obj?.userId?.id == c?.userId?.id)) a.push(c)
                return a;
            }, [])
            setDistCmnt(data)
        }
        setCmntLoader(false);
    }

    const handleCmntModal = (id: any) => {
        setPerticularUserCmnt(allCmnt?.reduce((a: any, c: any) => {
            if (c?.userId?.id == id) a.push(c)
            return a;
        }, []))
        setCmntModal(true);
    }

    useEffect(() => {
        if (data?.pictureID) getProfileData(data?.pictureID);
    }, [data?.pictureID])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20, paddingBottom: 0 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Details</Text>
                </TouchableOpacity>
            </View>
            {loader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                <ActivityIndicator size="large" color="#93278f" />
            </View> :
                <ScrollView style={{ padding: 20, paddingVertical: 0 }}>
                    <View style={{ flexDirection: "column", justifyContent: "space-between", height: responsiveHeight(83) }}>
                        <View>
                            <View>
                                <View style={{ padding: 0, margin: 0 }}>
                                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                        <Image source={{ uri: `${s3PreFixUrl}${artWorkData?.url}` }} style={[style.participentformImg, { height: 200, objectFit: "fill" }]} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View><Text style={{ fontSize: 16, color: "#93278f", fontWeight: "bold" }}>{artWorkData?.price ? `${artWorkData?.formId?.country != "IN" ? "$" : "₹"} ${artWorkData?.price}` : ""}</Text></View>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                        <View>
                                            {!likeImgArr?.includes(imgId) ? <TouchableOpacity onPress={() => { setIsLike(!isLike), favorite('like', imgId) }} disabled={likeLoader}>
                                                <Icon name={`favorite-border`} size={30} color="#93278f" />
                                            </TouchableOpacity> : <TouchableOpacity onPress={() => { setIsLike(!isLike), favorite("unlike", imgId) }} disabled={likeLoader}>
                                                <Icon name={`favorite`} size={30} color="#93278f" />
                                            </TouchableOpacity>}
                                        </View>
                                        {<View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 18, color: "#93278f" }}>{likeCount}</Text>
                                        </View>}
                                        <View>
                                            <TouchableOpacity>
                                                <Icon name="share" color="#93278f" size={30} style={{ marginLeft: 10 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {artWorkData?.formId?.category && <View style={{ padding: 5, paddingBottom: 0, paddingLeft: 0 }}>
                                <View style={style.row}>
                                    <Text style={style.detailsHead}>{_data[artWorkData?.formId?.category]} :</Text>
                                    <Text style={[style.detailsValue, { flex: 1, flexWrap: "wrap" }]}>{`${artWorkData?.formId?.name_of_participant ? `${artWorkData?.formId?.name_of_participant}, ` : ""} ${artWorkData?.formId?.category == "schoolStud" ? (artWorkData?.formId?.class_name ? `${artWorkData?.formId?.class_name}, ` : "") : artWorkData?.formId?.category == "collegeStud" ? (artWorkData?.formId?.std_qualification ? `${artWorkData?.formId?.std_qualification}, ` : "") : ""} ${artWorkData?.formId?.city ? `${artWorkData?.formId?.city}, ` : ""} ${artWorkData?.formId?.dist ? `${artWorkData?.formId?.dist}, ` : ""} ${artWorkData?.formId?.state ? `${artWorkData?.formId?.state},` : ""} ${countryArr?.reduce((a, c) => {
                                        if (c?.value == artWorkData?.formId?.country) a = c?.label
                                        return a;
                                    }, "") ?? ""} `}</Text>
                                </View>
                            </View>}
                        </View>

                        <View>
                            <>
                                {updatedCmntLoader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "30%" }}>
                                    <ActivityIndicator size="large" color="#93278f" />
                                </View> : !!distCmnt?.length && (artWorkData?.formId?.userId?.id == authData?.user?.userId) && <View style={[style.comntSec, { flexDirection: "column", justifyContent: "flex-end", height: responsiveHeight(40) }]}>
                                    <ScrollView>
                                        {distCmnt?.map((e: any, i) => (
                                            <TouchableOpacity key={i} onPress={() => handleCmntModal(e?.userId?.id)}>
                                                <View style={{ marginBottom: 10 }}>
                                                    <View style={style.pills}>
                                                        <View style={{marginRight:10}}>
                                                            <Icon name={`insert-comment`} size={20} color="#93278f" />
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: "#000" }}>{e?.userId?.name.slice(0,15) ?? ""} commented on your image</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>}
                                {/* {cmntLoader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(20) }}>
                                    <ActivityIndicator size="large" color="#93278f" />
                                </View> : <View style={{ padding: 20, paddingTop: 0, paddingBottom: 0 }}>
                                    <Input
                                        errorStyle={{ color: 'red' }}
                                        label="Message"
                                        value={comment}
                                        disabled={cmntLoader}
                                        style={[style.formGroup, { backgroundColor: "#972aa11a" }]}
                                        labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                        placeholderTextColor="#0D253C"
                                        onChangeText={val => handleComment(val, 'comment')}
                                        rightIcon={
                                            comment?.length ? (
                                                <Icon
                                                    disabled={cmntLoader}
                                                    name={"send"}
                                                    type="ionicon"
                                                    color="#93278f"
                                                    iconStyle={{ fontSize: 22, marginLeft: 10 }}
                                                    onPress={cmntLoader ? null : () => submit(comment, currImgDtls)}
                                                />
                                            ) : null
                                        }
                                    />
                                </View>} */}

                            </>

                            <Modal
                                visible={cmntModal}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setCmntModal(!cmntModal)}
                            >
                                <View style={styles.modalBackground}>
                                    <TouchableOpacity style={styles.closeButton} onPress={() => setCmntModal(!cmntModal)}>
                                        <Icon name="close" size={30} color="#fff" />
                                    </TouchableOpacity>
                                    <View style={{ backgroundColor: "#fff", height: responsiveHeight(70), width: responsiveWidth(90), flexDirection: "column" }}>
                                        {!!perticularUserCmnt?.length && <View style={[style.comntSec, { flexDirection: "column", justifyContent: "flex-end", height: "85%" }]}>
                                            <ScrollView>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 10 }}>
                                                    <Text style={{ paddingBottom: 5, margin: 0, marginTop: 5, color: "#93278f", fontSize: 14, textAlign: "left", fontWeight: "bold" }}>{perticularUserCmnt[0]?.userId?.name ?? ""}</Text>
                                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                        <TouchableOpacity disabled={blockUserLoader} onPress={() => blockUser(`${perticularUserCmnt[0]?.pictureId?.blockUsers.includes(perticularUserCmnt[0]?.userId?.id) ? "unblock" : "block"}`, perticularUserCmnt[0]?.pictureId?._id, perticularUserCmnt[0]?.userId?.id)} style={perticularUserCmnt[0]?.pictureId?.blockUsers.includes(perticularUserCmnt[0]?.userId?.id) ? style.unBlockBtn : style.blockBtn}><Text style={style.blockBtnText}>{perticularUserCmnt[0]?.pictureId?.blockUsers.includes(perticularUserCmnt[0]?.userId?.id) ? "Unblock" : "Block"}</Text></TouchableOpacity>
                                                        {blockUserLoader && <View style={{ marginLeft: 3 }}>
                                                            <ActivityIndicator size="small" color="#000" />
                                                        </View>}
                                                    </View>
                                                </View>
                                                {perticularUserCmnt?.map((e: any, i) => (
                                                    <View key={i} style={{ marginBottom: 10, paddingHorizontal: 20 }}>
                                                        {e?.isOwner ? <View style={style.outgoingCmnt}>
                                                            <Text>{e?.text}</Text>
                                                        </View> : <View style={style.incommingCmnt}>
                                                            <Text>{e?.text}</Text>
                                                        </View>}
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        </View>}
                                        {cmntLoader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "10%" }}>
                                            <ActivityIndicator size="large" color="#93278f" />
                                        </View> :
                                            <View style={{ padding: 20, paddingTop: 0, paddingBottom: 0, height: "10%" }}>
                                                <Input
                                                    errorStyle={{ color: 'red' }}
                                                    label="Message"
                                                    value={comment}
                                                    disabled={cmntLoader}
                                                    style={[style.formGroup, { backgroundColor: "#972aa11a" }]}
                                                    labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                                    placeholderTextColor="#0D253C"
                                                    onChangeText={val => handleComment(val, 'comment')}
                                                    rightIcon={
                                                        comment?.length ? (
                                                            <Icon
                                                                disabled={cmntLoader}
                                                                name={"send"}
                                                                type="ionicon"
                                                                color="#93278f"
                                                                iconStyle={{ fontSize: 22, marginLeft: 10 }}
                                                                onPress={cmntLoader ? null : () => submit(comment, perticularUserCmnt[0])}
                                                            />
                                                        ) : null
                                                    }
                                                />
                                            </View>}
                                    </View>
                                </View>
                            </Modal>


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
                                                    uri: `${s3PreFixUrl}${data?.url}`,
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </ScrollView>
            }
        </SafeAreaView >
    )
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
});

export default SingleExhibationImageScreen