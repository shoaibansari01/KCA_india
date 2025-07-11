import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { style } from '../../style/style';
import { AuthContext } from '../../helper/contex';
import { postReq } from '../../helper/http';
import { AnimatedIcon } from '../../components/animatedIcon';
import NoDataFoundMsg from '../../components/noDataFoundMsg';

export const Videos = ({ route, navigation }: any) => {
    const { authData }: any = useContext(AuthContext);
    const [videoArr, setVideoArr] = useState([]);
    const [loader, setLoader] = useState(false);

    const getVideos = async () => {
        const res = await postReq({
            url: `get-gallary-video-data`, data: authData?.user
        });
        if (res?.data?.length) {
            setVideoArr(res?.data?.reduce((a: any, c: any) => {
                if (c?.url.endsWith('.mp4')) a.push(c)
                return a;
            }, []));
        }
        setLoader(false);
    }

    useEffect(() => {
        setLoader(true);
        getVideos();
    }, [])

    return (
        <>
            {loader ? <View style={{ flexDirection: "row", height: "90%", justifyContent: "center", alignItems: "center" }}><ActivityIndicator size="large" color="#93278f" /></View> :
                <>
                    {!!videoArr?.length ? <SafeAreaView>
                        <ScrollView>
                            <View style={{ width: '100%', padding: 20, margin: 0 }}>
                                <View style={style.gallaryCard}>
                                    {!!videoArr?.length && videoArr.map((e: any, i) =>
                                        <TouchableOpacity onPress={() => { navigation.navigate('Details', { data: { ...e, from: "video" } }) }}>
                                            <View style={style.gallaryCard.item} key={i}>
                                                <AnimatedIcon name="smart-display" color="#93278f" size={60} />
                                                <Text style={style.gallaryCard.gallaryCardHeader}>{`${e?.formId?.name_of_art_teacher ? `${e?.formId?.principal_name ?? ""} / ${e?.formId?.name_of_art_teacher},` : ""} ${e?.formId?.city ? `${e?.formId?.city},` : ""
                                                    } ${e?.formId?.state ? `${e?.formId?.state}` : ""}`.slice(0, 20)}</Text>
                                                <Text>Details</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            {selectedVideo && (
                                <Video
                                    source={{ uri: selectedVideo }}
                                    style={styles.videoPlayer}
                                    controls={true}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    </Modal> */}

                            </View>
                        </ScrollView>
                    </SafeAreaView> : <NoDataFoundMsg />}
                </>
            }
        </>
    )
}