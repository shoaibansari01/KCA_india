import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { style } from '../../style/style'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { Button, Input } from 'react-native-elements'

const ConfirmationSection = ({ route, navigation }: any) => {
    const { studentEntry, classData, values, symbol, artWorkData, artWorkSelected, level }: any = route.params.data;
    const [finalData, setFinalData] = useState(studentEntry);
    const [edit, setEdit] = useState({ key: "", action: false });
    const [globalEdit, setGlobalEdit] = useState(false);
    const [newArticalVal, setNewArticalVal]: any = useState(artWorkSelected);
    const totalArtWorkSelected = () => artWorkData?.reduce((a: any, c: any) => {
        if (c?.value == newArticalVal?.art_work) a = c?.numberOfArtWork
        return a;
    }, 0)
    const [noOfArtWork, setNoOfAtrWork] = useState(totalArtWorkSelected());
    console.log({ noOfArtWork })

    const onChangeNational = (name: any, value: any) => {
        const _N = value.replace(/[^0-9]/g, '');
        getStudentsInfo({ clsName: name, noOfStd: value });
        setFinalData((pre: any) => ({ ...pre, [name]: _N }));
    };

    const onChangeGlobal = (val: any) => {
        const _N = val.replace(/[^0-9]/g, '');
        setNoOfAtrWork(_N)
        const _val = artWorkData.find((e: any) => e?.numberOfArtWork == _N)?.value;
        setNewArticalVal({ art_work: _val ? _val : 0 });
    }

    const totalStdCount = finalData && Object.values(finalData)?.reduce((a: any, c: any) => {
        a += parseInt(c);
        return a
    }, 0);


    // console.log({ totalArtWorkSelected })

    const getStudentsInfo: any = ({ clsName, noOfStd }: any) => {
        const fee = classData?.length && classData?.find((e: any) => e?.cls == clsName)?.fees;
        const total = fee * noOfStd;
        return { fee, total }
    }

    const totalFees = () => finalData && Object.keys(finalData).reduce((a, c) => {
        a += getStudentsInfo({ clsName: c, noOfStd: finalData[c] }).total
        return a;
    }, 0);
    console.log((globalEdit && values?.country != "IN"),'(globalEdit && values?.country != "IN")(globalEdit && values?.country != "IN")')

    const handleDetails = () => {
        navigation.navigate('FinalFeesConformation', { data: { global: { artWorkSelected: newArticalVal?.art_work, artWorkData, symbol, values }, national: { totalFees: totalFees(), finalData, classData, symbol }, level } });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Confirm Your Entry</Text>
                </TouchableOpacity>
                <View style={style.confirmEntrySec}>
                    <ScrollView>
                        {finalData && Object.keys(finalData)?.map((e, i) =>
                            <View style={style.confirmEntryCard} key={i}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                    <Text style={style.confirmEntryCardHead}>Class : {e}</Text>
                                    <Icon onPress={() => setEdit({ key: e, action: true })} name="edit" color="#93278f" size={24} style={{ marginStart: "auto" }} />
                                </View>
                                {[{ head: "Total Participants", count: finalData[e] }, { head: "Fees", count: getStudentsInfo({ clsName: e, noOfStd: finalData[e] })?.fee }, { head: "Total", count: `${symbol}  ${getStudentsInfo({ clsName: e, noOfStd: finalData[e] })?.total}` }].map(({ count, head }, i) =>
                                    <View key={i}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Text style={style.confirmEntryCardDetails}>{head}</Text>
                                            {(!i && edit?.key == e) ? <View style={{ backgroundColor: "#7c7c7c14", width: 80, borderRadius: 10 }}>
                                                <TextInput
                                                    value={finalData[e]}
                                                    onChangeText={(val) => onChangeNational(e, val)}
                                                    style={{ padding: 10, fontSize: responsiveFontSize(1.972), fontWeight: "bold", textAlign: "right" }}
                                                    placeholderTextColor="#0D253C"
                                                    keyboardType="numeric"
                                                    maxLength={10}
                                                    underlineColorAndroid="transparent"
                                                /></View> :
                                                <Text style={i == 2 ? style.confirmEntryCardDetailsTotal : style.confirmEntryCardDetails}>{count}</Text>
                                            }
                                        </View>
                                        {i != 2 && <View style={style.horizontalLine} />}
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={{ marginBottom: 30 }}>
                            <View style={style.confirmEntryCard}>
                                <View style={{ flexDirection: "row", justifyContent: `${level != "global" ? "center" : "space-between"}`, marginBottom: 20 }}>
                                    <Text style={style.confirmEntryCardHead}>Total Amount Of Fees</Text>
                                    {level == "global" && <Icon onPress={() => setGlobalEdit(!globalEdit)} name="edit" color="#93278f" size={24} style={{ marginStart: "auto" }} />}
                                </View>
                                {[{ head: `Total ${level != "global" ? "Students" : "Art Work"} `, count: totalStdCount ?? (globalEdit ? noOfArtWork : totalArtWorkSelected()) }, { head: "Total", count: `${symbol} ${totalFees()?.toFixed(2) ?? newArticalVal?.art_work}` }].map(({ count, head }: any, i) =>
                                    <View key={i}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Text style={style.confirmEntryCardDetails}>{head}</Text>
                                            {(!i && globalEdit) ? <View style={{ backgroundColor: "#7c7c7c14", width: 80, borderRadius: 10 }}>
                                                <TextInput
                                                    value={((globalEdit && values?.country != "IN") ? `${noOfArtWork}` : `${totalArtWorkSelected()}`)}
                                                    onChangeText={(val) => onChangeGlobal(val)}
                                                    style={{ padding: 10, fontSize: responsiveFontSize(1.972), fontWeight: "bold", textAlign: "right" }}
                                                    placeholderTextColor="#0D253C"
                                                    keyboardType="numeric"
                                                    maxLength={10}
                                                    underlineColorAndroid="transparent"
                                                /></View> : <Text style={i ? style.confirmEntryCardDetailsTotal : style.confirmEntryCardDetails}>{count}</Text>}
                                        </View>
                                        {!i && <View style={style.horizontalLine} />}
                                    </View>
                                )}
                            </View>
                        </View>
                        {(!!newArticalVal?.art_work || totalFees()) && <View style={{ marginStart: 'auto', marginBottom: 50 }}><Button
                            buttonStyle={{ backgroundColor: '#93278f' }}
                            titleStyle={{ color: '#fff' }}
                            title="Next"
                            containerStyle={{
                                width: 120,
                                borderRadius: 10,
                            }}
                            onPress={handleDetails}
                        /></View>}
                    </ScrollView>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default ConfirmationSection