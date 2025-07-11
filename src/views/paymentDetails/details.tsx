import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { style } from "../../style/style";
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { List } from "react-native-paper";
import moment from "moment";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Collapsible from 'react-native-collapsible';
import { DataTable } from 'react-native-paper';

const PaymentDetailsView = ({ props, route, navigation }: any) => {
    const animatedValue = new Animated.Value(0.1);

    const { data } = route.params;
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Payment Details</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        marginVertical: responsiveHeight(2)
                    }}>
                        <View style={style.circleIconBig}>
                            <Animated.View
                                style={{
                                    transform: [{ scale: animatedValue }],
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Icon size={40} color="#fff" name={data?.razorpay_signature ? "check" : "cancel"} />
                            </Animated.View></View>
                    </View>
                    <Text style={style.splashScreenTxt}>Participation fees of  {(!data?.isGlobal || data?.form_id?.country == "IN") ? "₹" : "$"} {data?.amount} {data?.razorpay_signature ? "Paid to KCA" : "Failed"}</Text>
                    <List.Section>
                        <List.Item title={`Order ID: ${data?.order_id.split("_").pop()}`} left={() => <List.Icon icon="receipt" />} />
                        <List.Item
                            title={`Payment Time: ${moment(data?.created_at).format("DD MMM YYYY HH:MM")}`}
                            left={() => <List.Icon icon="clock-time-three-outline" />}
                        />
                        {data?.isGlobal && <View>
                            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                                <List.Item
                                    title={`Participation Form`}
                                    left={() => <List.Icon icon="form-select" />}
                                />
                            </TouchableOpacity>
                            <Collapsible collapsed={isCollapsed}>
                                <View style={style.content}>
                                    <View>
                                        <Text style={style.colapsHead}>No of Art work selected : <Text style={style?.colapsHeadcount}>{data?.art_Work_select}</Text></Text>
                                    </View>
                                    <View>
                                        <Text style={style.colapsHead}>Total Fees : <Text style={style?.colapsHeadcount}>{(!data?.isGlobal || data?.form_id?.country == "IN") ? "₹" : "$"} {data?.amount}</Text></Text>
                                    </View>
                                </View>
                            </Collapsible>
                        </View>}
                        {data?.isNational && data?.student_data?.length && <View>
                            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                                <List.Item
                                    title={`Participation Form`}
                                    left={() => <List.Icon icon="form-select" />}
                                />
                            </TouchableOpacity>
                            <Collapsible collapsed={isCollapsed}>
                                <View style={style.content}>
                                    <DataTable>
                                        <DataTable.Header>
                                            <DataTable.Title>Class</DataTable.Title>
                                            <DataTable.Title numeric>Student</DataTable.Title>
                                            <DataTable.Title numeric>Fees</DataTable.Title>
                                            <DataTable.Title numeric>Total</DataTable.Title>
                                        </DataTable.Header>

                                        {data?.student_data?.length && data?.student_data.map((e: any) => <DataTable.Row>
                                            <DataTable.Cell>{e?.className ?? ""}</DataTable.Cell>
                                            <DataTable.Cell numeric>{e?.no_of_student ?? ""}</DataTable.Cell>
                                            <DataTable.Cell numeric>₹ {e?.fees ?? ""}</DataTable.Cell>
                                            <DataTable.Cell numeric>₹ {e?.total ?? ""}</DataTable.Cell>
                                        </DataTable.Row>
                                        )}
                                    </DataTable>
                                </View>
                            </Collapsible>
                        </View>}
                        <List.Item
                            title="Go To Dashbaord"
                            onPress={() => {
                                navigation.navigate('UserDashboard', { data: { values: { ...data?.form_id }, level: data?.isGlobal ? "global" : "national" } })
                            }}
                            titleStyle={{ color: "#93278f", textDecorationLine: "underline" }}
                            left={() => <List.Icon icon="view-dashboard" color="#93278f" />}
                        />
                    </List.Section>



                    {/* {!payments?.length ? <Text style={[style.fs18, style.boldText, style.textColorBlack]}>No Data Found</Text> : <View>
                        {payments.map((e: any, i) =>
                            <TouchableOpacity key={i} onPress={() => {
                                // navigation.navigate(redirect)
                            }}>
                                <ListItem key={i} bottomDivider containerStyle={{ backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 0 }}>
                                    <View style={style.circleIcon}><Icon size={18} color="#fff" name={e?.razorpay_signature ? "check" : "cancel"} /></View>
                                    <ListItem.Content >
                                        <ListItem.Title style={style.userOptDtls.text}>Payment Of ₹ {e?.amount} {e?.razorpay_signature ? "Recieved" : "Failed"}</ListItem.Title>
                                        <ListItem.Title style={style.userOptDtls.subText}>{moment(e?.created_at).format("DD MMM YYYY HH:MM")}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron color="#000" />
                                </ListItem>

                            </TouchableOpacity>
                        )}

                    </View>} */}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PaymentDetailsView;