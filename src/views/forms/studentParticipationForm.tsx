import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { style } from '../../style/style'
import { onShare } from '../../helper/reusableFun';

const StudentParticipationForm = ({ route, navigation }: any) => {
    const { data, title, name } = route.params;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>{name ?? ""}</Text>
                </TouchableOpacity>
                {/* <View style={style.brochureInfo}>
                    <Image source={formImg} style={style.participentformImg} />
                    <TermAndCond {...{ data: termAndCon }} />
                </View> */}
                <ScrollView>
                    <View>
                        <Text style={style.stdParticipentHead}>Student Participation Form</Text>
                        <Text style={style.stdParticipentText}>The student participation form link will be shared to all students exclusively by School Principal, Art Teacher or any designated school authority.</Text>
                        <Text style={style.stdParticipentText}>Interested students will complete the form,and fees will be collected by the Principal, Art Teacher, or the person in charge of overseeing the competition.
                        </Text>
                        <Text style={style.stdParticipentText}>This process ensures that all participation and fee submissions are handled securely and efficiently through official school channels.</Text>

                        <View style={{ marginLeft: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                            <Text style={style.googleFormRedirect}>Students' Participation Form</Text>
                            {/* <BlinkingText /> */}
                            <TouchableOpacity onPress={() => onShare('Students, please fill out this participation form: https://forms.gle/B855xNjoZwgCvRxH6', 'https://forms.gle/B855xNjoZwgCvRxH6')}>
                                <Icon name="share" color="#93278f" size={22} style={{ marginRight: 14 }} />
                            </TouchableOpacity>
                        </View>

                        {/* <View style={{ flexDirection: "row", marginTop: 10, paddingLeft: 10 }}>
                            <TouchableOpacity onPress={copyToClipboard}>
                        <Icon name="link" color="#93278f" size={22} style={{ marginRight: 14 }} />
                    </TouchableOpacity>
                            <TouchableOpacity onPress={() => onShare('Students, please fill out this participation form: https://forms.gle/B855xNjoZwgCvRxH6', 'https://forms.gle/B855xNjoZwgCvRxH6')}>
                                <Icon name="share" color="#93278f" size={22} style={{ marginRight: 14 }} />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default StudentParticipationForm