import { Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { style } from '../style/style'
import { useNavigation } from '@react-navigation/native';
import { postReq } from '../helper/http';
import { AuthContext } from '../helper/contex';

const Header = () => {
    const { authData }: any = useContext(AuthContext);
    const navigation: any = useNavigation();
    const openDrawer = () => navigation.openDrawer();
    const [data, setData]: any = useState([]);
    const getNotification = async () => {
        const res = await postReq({
            url: `get-notification`, returnKey: "data"
        });
        res?.length && setData(res.filter((e: any) => !e?.readBy?.includes(authData?.user?.userId)))
    }
    const handleNotification = () => navigation.navigate("Notification", { data });

    useEffect(() => {
        getNotification()
    }, [])
    return (<View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={openDrawer}>
                <Icon name="person-outline" color="#130F26" size={30} />
            </TouchableOpacity>
            <Text style={[style.fs20, style.boldText, style.textColorBlack]}>KCA</Text>
            <TouchableOpacity onPress={handleNotification}>
                <Icon name={`${!!data?.length ? "notifications-active" : "notifications-none"}`} color={`${!!data?.length ? "#28a745" : "#130F26"}`} size={30} />
            </TouchableOpacity>
        </View>
    </View>)
}

export default Header
