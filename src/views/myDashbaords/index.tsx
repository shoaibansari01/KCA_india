import { View, Text, TouchableOpacity, Alert, Button, ScrollView } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { style } from "../../style/style";
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { ListItem } from "react-native-elements";
import { AuthContext } from "../../helper/contex";
import { postReq } from "../../helper/http";
import { ActivityIndicator, List } from "react-native-paper";
import { cardsMappped } from "../home";
import moment from "moment";
import { responsiveHeight } from "react-native-responsive-dimensions";

const MyDasboards = ({ props, navigation }: any) => {
    const { authData, setAuthData }: any = useContext(AuthContext);
    const [forms, setForms]: any = useState([]);
    const [nomini, setNomini]: any = useState([]);
    const [isLoading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        const res = await postReq({
            url: `get-all-my-forms`, returnKey: "data"
        });
        setForms(Array.isArray(res?.registration) ? res?.registration : []);
        setNomini(Array.isArray(res?.nomini) ? res?.nomini : []);
        setLoading(false);
    }


    useEffect(() => {
        getData();
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>My Dashbords</Text>
                </TouchableOpacity>
                {isLoading ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                    <ActivityIndicator size="large" color="#93278f" />
                </View> : <ScrollView>
                    {!forms?.length ? <Text style={[style.fs18, style.boldText, style.textColorBlack]}>No Data Found</Text> : <View>
                        <List.Section>
                            <List.Subheader style={{ fontWeight: "bold", fontSize: 16, color: "#000" }}>{cardsMappped[0].title}</List.Subheader>
                            {!!nomini?.length ? nomini?.map((e: any) => <List.Item title={`${e?.parent_name} | ${moment(e?.created_at).format("DD MMM YYYY HH:MM")}`} right={() => <List.Icon icon="arrow-right" />}
                                // onPress={() => {
                                //     navigation.navigate('UserDashboard', { data: { values: { ...e }, level: e?.formType == "G" ? "global" : "national" } })
                                // }}
                            />) : <List.Item title={"No Data Found"} />}
                        </List.Section>
                        <List.Section>
                            <List.Subheader style={{ fontWeight: "bold", fontSize: 16, color: "#000" }}>{cardsMappped[1].title}</List.Subheader>
                            {forms.filter((e: any) => e?.formType == "N").length ? forms.filter((e: any) => e?.formType == "N").map((e: any) => <List.Item title={`${e?.principal_name} | ${moment(e?.created_at).format("DD MMM YYYY HH:MM")}`} right={() => <List.Icon icon="arrow-right" />}
                                onPress={() => {
                                    navigation.navigate('UserDashboard', { data: { values: { ...e }, level: e?.formType == "G" ? "global" : "national" } })
                                }}
                            />) : <List.Item title={"No Data Found"} />}
                        </List.Section>
                        <List.Section>
                            <List.Subheader style={{ fontWeight: "bold", fontSize: 16, color: "#000" }}>{cardsMappped[2].title}</List.Subheader>
                            {forms.filter((e: any) => e?.formType == "G").length ? forms.filter((e: any) => e?.formType == "G").map((e: any) => <List.Item title={`${e?.name_of_participant} | ${moment(e?.created_at).format("DD MMM YYYY HH:MM")}`} right={() => <List.Icon icon="arrow-right" />}
                                onPress={() => {
                                    navigation.navigate('UserDashboard', { data: { values: { ...e }, level: e?.formType == "G" ? "global" : "national" } })
                                }}
                            />) : <List.Item title={"No Data Found"} />}
                        </List.Section>
                    </View>}
                </ScrollView>}
            </View>
        </SafeAreaView>
    );
};

export default MyDasboards;