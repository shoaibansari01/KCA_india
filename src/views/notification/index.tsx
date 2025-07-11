import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { style } from '../../style/style';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { postReq } from '../../helper/http';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import NoDataFoundMsg from '../../components/noDataFoundMsg';
import moment from 'moment';
import { titleCase } from '../../helper/normConsistent';
import { AuthContext } from '../../helper/contex';

const Notification = ({ navigation, route }: any) => {
    const { authData }: any = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [readLoader, setReadLoader] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [listData, setListData] = useState([]);
    const [notify, setNotify]: any = useState({});
    
    const getNotification = async () => {
        setLoader(true);
        const res = await postReq({
            url: `get-notification`, returnKey: "data"
        });
        res && setListData(res)
        setLoader(false);
    }

    const handleNotif = async (data: any) => {
        setReadLoader(true);
        setModalVisible(true);
        setNotify(data);
        if (!data?.readBy.includes(authData?.user?.userId)) {
            await readNotification(data?._id);
            getNotification();
        }
        setReadLoader(false);
    }

    const readNotification = async (id: any) => {
        const res = await postReq({
            url: `read-notification`, data: { notificationId: id, userId: authData?.user?.userId }, returnKey: "data"
        });
    }

    useEffect(() => {
        getNotification();
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Notification</Text>
                </TouchableOpacity>
                <View>
                    <ScrollView>
                        {loader ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                            <ActivityIndicator size="large" color="#93278f" />
                        </View> : !!listData?.length ? <View style={{ paddingBottom: 30 }}>
                            {listData?.map((e: any, i: any) =>
                                <TouchableOpacity onPress={() => handleNotif(e)}>
                                    <View style={style.notificationList}>
                                        <Text style={{ color: "#000", fontSize: responsiveFontSize(2) }}>{e?.title?.slice(0, 36)}</Text>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text>{moment(e?.createdAt).format("DD-MM-YYYY")}</Text>
                                            <View style={{ marginLeft: 5 }}>
                                                <Icon name={`${e?.readBy.includes(authData?.user?.userId) ? "" : "circle"}`} color="#28a745" size={10} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View> : <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                            <Text style={[style.fs18, style.boldText, style.textColorBlack]}>No Data Found</Text>
                        </View>}
                    </ScrollView>
                </View>


                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.modalBackground}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => { !readLoader && setModalVisible(!modalVisible) }}>
                            <Icon name="close" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ backgroundColor: "#fff", height: responsiveHeight(70), width: responsiveWidth(90), flexDirection: "column" }}>
                            <View style={{ padding: 20 }}>
                                <Text style={{ textAlign: "center", fontSize: 20, color: "#000", marginBottom: 10 }}>{notify?.title}</Text>
                                <Text style={{ textAlign: "right", fontSize: 11, color: "#93278f", marginBottom: 10, fontWeight: "600" }}>{moment(notify?.createdAt).format("DD-MM-YYYY")}</Text>
                                <View style={{ height: responsiveHeight(58), paddingBottom: 20 }}>
                                    <ScrollView>
                                        <Text style={{ fontSize: 14 }}>{notify?.description}</Text>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
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
});

export default Notification;
