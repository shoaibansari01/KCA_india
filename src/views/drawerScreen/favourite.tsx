import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { AuthContext } from '../../helper/contex'
import { postReq } from '../../helper/http'
import { Image } from 'react-native-elements'
import { s3PreFixUrl } from '../../helper/routes'
import { responsiveHeight } from 'react-native-responsive-dimensions'

const Favourite = ({ navigation }: any) => {
    const { authData }: any = useContext(AuthContext);
    const [fileArr, setFileArr] = useState([]);
    const [loader, setLoader] = useState(false);

    const getExhibitionData = async () => {
        setLoader(true);
        const res = await postReq({
            url: `get-favourite`, data: { userId: authData?.user?.userId }, returnKey: "data"
        });
        if (res?.length) setFileArr(res);
        setLoader(false);
    }

    useEffect(() => {
        getExhibitionData();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Favourites</Text>
                </TouchableOpacity>
                {loader ? <View style={{ flexDirection: "row", height: responsiveHeight(80), justifyContent: "center", alignItems: "center" }}><ActivityIndicator size="large" color="#93278f" /></View> :
                    !!fileArr?.length ?
                        <ScrollView>

                            <View style={{ width: '100%', paddingTop: 0, margin: 0 }}>
                                <View style={style.gallaryCard}>
                                    {fileArr.map((e: any, i: any) =>
                                        <View style={style.gallaryCard.item} key={i}>
                                            <Image source={{ uri: `${s3PreFixUrl}${e?.pictureId?.url}` }} style={{ width: "100%", height: 120, borderRadius: 7 }} />
                                            <Text style={style.gallaryCard.gallaryCardHeader}>{e?.formId?.name_of_participant ?? ""}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                        : <View style={{ flexDirection: "row", height: responsiveHeight(80), justifyContent: "center", alignItems: "center" }}><Text style={[style.fs18, style.boldText, style.textColorBlack]}>No Data Found</Text></View>

                }
            </View>
        </SafeAreaView>
    )
}

export default Favourite