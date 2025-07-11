import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { style } from '../../style/style';
import { createStackNavigator } from '@react-navigation/stack';
import ExhibitionDetails from './exhibationDetails';
import { postReq } from '../../helper/http';
import { AuthContext } from '../../helper/contex';
import { s3PreFixUrl } from '../../helper/routes';
import NoDataFoundMsg from '../../components/noDataFoundMsg';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const Stack = createStackNavigator();



const ExhibitionData = ({ route, navigation }: any) => {
    const { authData }: any = useContext(AuthContext);
    const [fileArr, setFileArr] = useState([]);
    const [loader, setLoader] = useState(false);


    const getExhibitionData = async () => {
        setLoader(true);
        const res = await postReq({
            url: `get-exhibition-data`, data: authData?.user, returnKey: "data"
        });
        if (res?.length) setFileArr(res);
        setLoader(false);
    }

    useEffect(() => {
        getExhibitionData();
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text style={style.pageHeading}>Exhibition</Text>
                <Text style={style.pageSubHead}>Global Art Exhibition</Text>
            </View>
            {loader ? <View style={{ flexDirection: "row", height: "80%", justifyContent: "center", alignItems: "center" }}><ActivityIndicator size="large" color="#93278f" /></View> : <ScrollView>
                <View style={{ width: '100%', paddingTop: 0, paddingHorizontal: 20, margin: 0 }}>
                    {!!fileArr?.length ? <View style={style.gallaryCard}>
                        {fileArr?.map((e: any, i: any) =>
                            <TouchableOpacity onPress={() => { navigation.navigate('ExhibitionDetails', { data: { ...e, ...authData?.user } }) }} style={{ backgroundColor: "#ffffff00" }}>
                                <View style={style.gallaryCard.item} key={i}>
                                    <Image source={{ uri: `${s3PreFixUrl}${e?.url}` }} style={{ width: "100%", height: 120, borderRadius: 7 }} />
                                    <Text style={style.gallaryCard.gallaryCardHeader}>{e?.formId?.name_of_participant?.slice(0, 20)}</Text>
                                    <Text>Details</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View> : <View style={{ flexDirection: "row", height: responsiveHeight(78), justifyContent: "center", alignItems: "center" }}>
                        <NoDataFoundMsg />
                    </View>
                    }
                </View>
            </ScrollView>}
        </View>
    )
}

const ExhibitionScreen = () => (
    <Stack.Navigator
        initialRouteName="ExhibitionData"
        screenOptions={{
            headerShown: false,

        }}>
        <Stack.Screen
            name='ExhibitionData'
            component={ExhibitionData}
            options={{ header: () => null }}
        />
        <Stack.Screen
            name='ExhibitionDetails'
            component={ExhibitionDetails}
            options={{ header: () => null }}
        />
    </Stack.Navigator>

);

export default ExhibitionScreen