import { View, Text, TouchableOpacity, Alert, Button, ScrollView } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { style } from "../../style/style";
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { ListItem } from "react-native-elements";
import { AuthContext } from "../../helper/contex";
import { postReq } from "../../helper/http";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";
import { responsiveHeight } from "react-native-responsive-dimensions";

const PaymentDetails = ({ props, navigation }: any) => {
    const { authData, setAuthData }: any = useContext(AuthContext);
    const [payments, setPayments]: any = useState([]);
    const [isLoading, setLoading] = useState(true);


    const getDate = async () => {
        setLoading(true);
        const res = await postReq({
            url: `get-payments`, returnKey: "data"
        });
        setPayments(Array.isArray(res) ? res : []);
        setLoading(false);
    }


    useEffect(() => {
        getDate()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Payments</Text>
                </TouchableOpacity>
                {isLoading ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: responsiveHeight(80) }}>
                    <ActivityIndicator size="large" color="#93278f" />
                </View> : <ScrollView>
                    {!payments?.length ? <Text style={[style.fs18, style.boldText, style.textColorBlack]}>No Data Found</Text> : <View>
                        {payments.map((e: any, i) =>
                            <TouchableOpacity key={i} onPress={() => {
                                navigation.navigate(`PaymentDetailsView`, { data: e });
                            }}>
                                <ListItem key={i} bottomDivider containerStyle={{ backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 0 }}>
                                    <View style={style.checkedIcon}><Icon size={16} color="#fff" name={e?.razorpay_signature ? "check" : "cancel"} /></View>
                                    <ListItem.Content >
                                        <ListItem.Title style={style.userOptDtls.text}>Payment Of {(e?.form_id?.formType == "G" && e?.form_id?.country != "IN") ? "$" : "₹"} {e?.amount} {e?.razorpay_signature ? "Paid to KCA" : "Failed"}</ListItem.Title>
                                        <ListItem.Title style={style.userOptDtls.subText}>{moment(e?.created_at).format("DD MMM YYYY HH:MM")}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron color="#000" />
                                </ListItem>

                            </TouchableOpacity>
                        )}

                    </View>}
                </ScrollView>}
            </View>
        </SafeAreaView>
    );
};

export default PaymentDetails;