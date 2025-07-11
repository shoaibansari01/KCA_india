import { View, Text, TouchableOpacity, ScrollView, Share, Button, Alert, StyleSheet, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { handleOpenInChrome, onShare } from '../../helper/reusableFun'
import { TextInput } from 'react-native-paper'
import { BlinkingText } from '../../components/BlinkingText'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import { CheckBox } from 'react-native-elements'

const NominationForm = ({ navigation }: any) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleLinkPress = (url: any) => {
        Linking.openURL(url);
    };

    useEffect(() => {
        if (isChecked) {
            navigation.navigate('NominiForm');
            setIsChecked(false);
        }
    }, [isChecked])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={24} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>
                        National Kids Achievers Genius Awards
                    </Text>
                </TouchableOpacity>
                <ScrollView style={styles.container}>
                    <Text style={style.nomination?.heading}>NOMINATION PROCEDURE</Text>
                    <Text style={style.nomination?.intro}>National Kids Achievers Genius Awards, organized by KCA, honor exceptional children aged 3 to 18 who have demonstrated extraordinary talent and accomplishments in various fields. This program provides a national platform for young achievers to showcase their abilities and uniqueness. By celebrating young talent, the awards encourage children to pursue their dreams with confidence and dedication, promoting a spirit of excellence and innovation.</Text>
                    <View style={styles.section}>
                        <Text style={styles.title}>Key Highlights : National Kids Achievers Genius Awards: </Text>
                        <Text style={styles.bold}>Age Range :</Text>
                        <Text style={styles.text}>Open to children aged 3 to 18 years.</Text>

                        <Text style={styles.bold}>National Recognition :</Text>
                        <Text style={styles.text}>Provides national visibility and appreciation for young achievers.</Text>

                        <Text style={styles.bold}>Various Categories:</Text>
                        <Text style={styles.text}>Awards across multiple categories reflecting diverse talents and achievements.</Text>

                        <Text style={styles.bold}>Publicity :</Text>
                        <Text style={styles.text}>Top achievers featured on</Text>
                        <TouchableOpacity onPress={() => handleLinkPress('https://www.kcaindia.com/')}>
                            <Text style={styles.link}>www.kcaindia.com</Text>
                        </TouchableOpacity>
                        <Text style={styles.text}>leading newspapers, and all social media platforms.</Text>

                        <Text style={styles.bold}>Prestige and Honor :</Text>
                        <Text style={styles.text}>Recognized as a prestigious honor, encouraging continued excellence.</Text>

                        <Text style={styles.text}>
                            <Text style={styles.bold}>National  Kids Achievers Genius Award 2026</Text>
                            {'\n'}Top 25 awardees (from School students & College students) in each category will receive :
                        </Text>
                        <Text style={styles.text}>National Kids Achievers Genius Award 2025 Certificate.</Text>
                        <Text style={styles.text}>Trophy.</Text>
                        <Text style={styles.text}>Gold Medal.</Text>
                        <Text style={styles.subtextBold}>National renowned personalities will inspire young achievers, with extensive national wide media coverage celebrating the Awardees' achievements in the award ceremony. </Text>
                        <Text style={styles.text}>All Participants will receive a Participation Certificate of National Kids Achievers Genius Award 2025 (select categories in the nomination form)</Text>

                        <Text style={styles.bold}>Age Requirement :</Text>
                        <Text style={styles.text}>Participants must be up to 18 years old.</Text>
                        <Text style={styles.bold}>Category Limitation :</Text>
                        <Text style={styles.text}>Apply for only one or many categories that best fits the child's achievements.</Text>
                        <Text style={styles.bold}>Nomination Fee:</Text>
                        <Text style={styles.text}>Pay Rs. 150 for single category (keep and share the payment screenshot for reference)</Text>
                        <Text style={styles.text}>(Nomination fee which is non-refundable is for branding  and promotional  to be paid).</Text>
                        <Text style={styles.bold}>Pay Fees : </Text>
                        <Text style={styles.text}>Pay Rs. 150 using KCA QR code/ Google pay/Upid/Phonepe(Rs.150 for single category) (Please keep the payment screenshot for reference)</Text>

                        <Text style={styles.bold}>Submit the Nomination :</Text>
                        <Text style={styles.text}>Complete and submit the form by 31st January 2026.</Text>
                        <Text style={styles.text}>Once all the required fields are filled and documents uploaded, submit the nomination form and complete the payment.</Text>

                        <Text style={styles.bold}>Confirmation and Evaluation :</Text>
                        <Text style={styles.text}>Once the form is submitted, you will receive a confirmation email acknowledging receipt of the nomination.</Text>
                        <Text style={styles.text}>The child's/particiants profile will be sent to the jury members for evaluation.</Text>
                        <Text style={styles.bold}>Results : </Text>
                        <Text style={styles.text}>Results will be Visible on KCA APP by 15th March 2026</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}>Evaluation Process for the National Kids Achievers Awards</Text>
                        <Text style={styles.bold}>Submission of Nomination Form :</Text>
                        <Text style={styles.text}>Parents for their child/Participants submit the nomination form with details and supporting documents.</Text>

                        <Text style={styles.bold}>Initial Review :</Text>
                        <Text style={styles.text}>KCA team ensures all information is complete and meets eligibility criteria.</Text>

                        <Text style={styles.bold}>Evaluation by the Panel :</Text> 
                        <Text style={styles.text}>A panel of experts assesses each nomination based on criteria like impact, uniqueness, and effort.</Text>

                       <Text style={styles.bold}>Shortlisting :</Text> 
                       <Text style={styles.text}>Top candidates demonstrating exceptional achievements are shortlisted.</Text>

                        <Text style={styles.bold}>Final Selection :</Text>
                        <Text style={styles.text}>Shortlisted nominations undergo further review for final selection of top achievers.</Text>

                        <Text style={styles.bold}>Notification :</Text> 
                        <Text style={styles.text}>Parents of selected children /participants are informed via email with details about the next steps and the award ceremony.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.title}>National Kids Achievers Genius Awards Ceremony</Text>
                        <Text style={styles.bold}>Date :</Text> 
                        <Text style={styles.text}>Saturday, 26th April 2026.</Text>
                        <Text style={styles.bold}>Location :</Text> 
                        <Text style={styles.text}>Nagpur (Venue details to be informed to the awardees post-result declaration).</Text>
                        <Text style={styles.bold}>Guest Speakers :</Text> 
                        <Text style={styles.text}>Renowned personalities from various fields to inspire the young achievers.</Text>
                        <Text style={styles.bold}>Extensive Media Coverage :</Text> 
                        <Text style={styles.text}>Wide media coverage to highlight and celebrate the achievements of the awardees.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.text}>This is a significant award ceremony designed to honor and celebrate the extraordinary achievements of young talents, encouraging them to continue striving for excellence and making a positive impact in their communities.</Text>
                    </View>

                    <View style={{ marginBottom: 50 }}>
                        <CheckBox
                            center
                            title="I accept and agree to follow the procedure."
                            checked={isChecked}
                            onPress={() => setIsChecked(!isChecked)}
                            containerStyle={{ backgroundColor: "none" }}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        // backgroundColor: '#fff',
    },
    section: {
        marginBottom: 24,
    },
    title: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#001B47'
    },
    bold: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold',
        color: '#93278f'
    },
    subText: {
        fontSize: responsiveFontSize(1.5),
        // fontWeight: 'bold',
        color: '#93278f'
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 5,
    },
    text: {
        color: "#001B47"
    },
    subtextBold: {
        fontSize: responsiveFontSize(1.8),
        marginVertical:5,
        fontWeight: 'bold',
        color: "#001B47"
    }
});

export default NominationForm