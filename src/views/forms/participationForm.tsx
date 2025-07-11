import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { style } from '../../style/style'
import formImg from '../../assets/images/partcipentFormImg.png';
import { Button, Input } from 'react-native-elements'
import TermAndCond from '../../components/termAndCond'
import DropDown from '../../components/dropDown'
import { s3PreFixUrl } from '../../helper/routes'
import { responsiveHeight } from 'react-native-responsive-dimensions'

const termAndCon: any = { head: { mainHead: "Participation Form Accessibility:", subHead: "The participation form is open for all creative individuals passionate about art." }, body: [{ head: "Participation Fees Structure", content: "Participation fees are determined based on the number of artworks submitted in the participation form." }, { head: "Artwork Submission and Online Exhibition", content: "After submitting the participation form, upload your artwork to be featured in the online exhibition. Your artwork will be showcased prominently by sharing your artwork to maximum persons." }, { head: "International Platform for Art Sales", content: "Earn by sale your artworks. Our platform serves as the largest international platform for online exhibitions and facilitates the sale of your artwork." }] };

const ParticipationForm = ({ route, navigation }: any) => {
    const { data, title } = route.params;
    const [artWorkSelected, setArtWorkSelected] = useState({ art_work: "" });
    const [expanded, setExpanded] = useState(true);
    const symbol = `${data?.level == "global" && data?.values?.country != "IN" ? "$" : "₹"}`;

    const artWorkData = [{ label: `1 Artwork : ${symbol} ${data?.values?.country != "IN" ? 6 : 100}`, value: (data?.values?.country != "IN" ? 6 : 100), numberOfArtWork: 1 }, { label: `2 Artwork : ${symbol} ${data?.values?.country != "IN" ? 7 : 125}`, value: (data?.values?.country != "IN" ? 7 : 125), numberOfArtWork: 2 }, { label: `3 Artwork : ${symbol} ${data?.values?.country != "IN" ? 8 : 175}`, value: (data?.values?.country != "IN" ? 8 : 175), numberOfArtWork: 3 }, { label: `4 Artwork : ${symbol} ${data?.values?.country != "IN" ? 9 : 250}`, value: (data?.values?.country != "IN" ? 9 : 250), numberOfArtWork: 4 }, { label: `5 Artwork : ${symbol} ${data?.values?.country != "IN" ? 10 : 350}`, value: (data?.values?.country != "IN" ? 10 : 350), numberOfArtWork: 5 }]

    const handleDetails = () => {
        navigation.navigate('ConfirmationSection', { data: { values: data?.values, symbol, artWorkData, artWorkSelected, level: data?.level } });
    };

    const handleChange = (e: any) => {
        setArtWorkSelected({ art_work: e?.value });
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>{title ?? ""}</Text>
                </TouchableOpacity>
                <View style={style.brochureInfo}>
                    <TermAndCond {...{ data: termAndCon, expanded, setExpanded }} />
                </View>
                {
                    data?.isPaymentDone ? <View style={{ height: responsiveHeight(40), flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Need to fill out the participation form again? </Text>
                            <Text style={{ fontSize: 16, color: "#93278f", fontWeight: "bold" }}>Go to the homepage of the Global Art Exhibition {'>'} Refill Individual registration</Text>
                        </View>
                    </View> :
                        <ScrollView>
                            <View>
                                <Text style={style.participentSelect}>Select number of participants </Text>
                                <View style={style.horizontalLine} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <DropDown {...{ data: artWorkData, label: "Select Number of Artwork", handleChange, name: 'art_work', values: artWorkSelected }} />
                                </View>
                            </View>
                            {artWorkSelected?.art_work && <View style={{ alignSelf: "flex-end", margin: 20 }}><Button
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
                }
            </View>
        </SafeAreaView>
    )
}

export default ParticipationForm