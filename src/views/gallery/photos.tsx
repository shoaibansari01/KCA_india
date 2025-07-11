import { View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { style } from '../../style/style';
import { AuthContext } from '../../helper/contex';
import { postReq } from '../../helper/http';
import { s3PreFixUrl } from '../../helper/routes';
import { titleCase } from '../../helper/normConsistent';

const Photos = ({ route, navigation }: any) => {
    const { authData }: any = useContext(AuthContext);
    const [fileArr, setFileArr] = useState([]);
    const [loader, setLoader] = useState(false);

    const getdata = async () => {
        setLoader(true);
        const res = await postReq({
            url: `get-gallary-data`, data: authData?.user, returnKey: 'data'
        });
        if (res?.length) {
            setFileArr(res?.reduce((a: any, c: any) => {
                if (!c?.url.endsWith('.mp4')) a.push(c)
                return a;
            }, [])?.sort((a: any, b: any) => {
                if (a.formId?.principal_name < b.formId?.principal_name) return -1;
                if (a.formId?.principal_name > b.formId?.principal_name) return 1;
                return 0;
            }));
        }
        setLoader(false);
    }

    useEffect(() => {
        getdata();
    }, [])

    return (
        <>
            {loader ? <View style={{ flexDirection: "row", height: "90%", justifyContent: "center", alignItems: "center" }}><ActivityIndicator size="large" color="#93278f" /></View> :
                <SafeAreaView>
                    <ScrollView>
                        <View style={{ width: '100%', padding: 20, margin: 0 }}>
                            <View style={style.gallaryCard}>
                                {!!fileArr?.length && fileArr?.map((e: any, i) =>
                                    <TouchableOpacity style={{ backgroundColor: "#ffffff00" }} onPress={() => { navigation.navigate('Details', { data: { ...e, from: "photos" } }) }}>
                                        <View style={style.gallaryCard.item} key={i}>
                                            <Image source={{ uri: `${s3PreFixUrl}${e.url}` }} style={{ width: "100%", height: 120, borderRadius: 7 }} />
                                            <Text style={style.gallaryCard.gallaryCardHeader}>{`${e?.formId?.name_of_art_teacher ? `${e?.formId?.principal_name ?? ""} / ${e?.formId?.name_of_art_teacher},` : ""} ${e?.formId?.city ? `${e?.formId?.city},` : ""
                                                } ${e?.formId?.state ? `${e?.formId?.state}` : ""}`.slice(0, 20)}</Text>
                                            <Text>Details</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>}
        </>
    )
}
export default Photos;