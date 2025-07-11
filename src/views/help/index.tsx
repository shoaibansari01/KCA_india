import { View, Text, SectionList, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { style } from '../../style/style';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements/dist/icons/Icon'

const HelpScreen = () => {

    const openInBrowser = async (url: any) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    };
    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <Text style={style.pageHeading}>FAQ</Text>
                <ScrollView>
                    <View style={style.faqSec}>
                        <View>
                            <Text style={style.faqHead}>NATIONAL TALENT SEARCH DRAWING AND PAINTING SCHOLARSHIP COMPETITION -2025 (SCHOOL REGISTRATION)</Text>
                            <View>
                                <Text style={style.subHead}>1. How to get information regarding National Talent Search Drawing and Painting Scholarship Competition-2025?</Text>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text><Text style={{ color: "#000" }}>a.</Text> Visit <TouchableOpacity onPress={() => openInBrowser("https://kcaindia.com/")}><Text style={{ color: "#93278f", paddingBottom: 0 }}>www.kcaindia.com</Text></TouchableOpacity> or download the <TouchableOpacity onPress={() => openInBrowser("https://play.google.com/store/apps/details?id=com.kcagroup&pcampaignid=web_share")}><Text style={{ color: "#93278f", paddingBottom: 0 }}>KCA App.</Text></TouchableOpacity></Text>
                                    <Text><Text style={{ color: "#000" }}>b.</Text> Sign in to your account.</Text>
                                    <Text><Text style={{ color: "#000" }}>c.</Text> On the homepage or within the app, navigate to the section labeled <Text style={{ fontWeight: "bold" }}>"School Registration."</Text></Text>
                                    <Text><Text style={{ color: "#000" }}>d.</Text> View the details provided under the school registration section to gather information about the competition.</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={style.subHead}>2. Who can fill out the registration form and who can participate?</Text>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text><Text style={{ color: "#000" }}>a.</Text> Only School Principals, Art Teachers, or any School Authority are authorized to fill the School Registration Form for the National Talent Search Drawing and Painting Scholarship Competition-2025. They will receive all the necessary details after submitting the registration form.</Text>
                                    <Text><Text style={{ color: "#000" }}>b.</Text> Students from Nursery to Class 10th from registered schools in KCA are eligible to participate in their respective schools. Parents or students themselves are not allowed to fill out the registration form.</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={style.faqHead}>GLOBAL ART EXHIBITION</Text>
                            <View>
                                <Text style={style.subHead}>1. What is Global Art Exhibition and who will participate in Global Art Exhibition?</Text>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text><Text style={{ color: "#000" }}>a.</Text> The Global Art Exhibition stands as the largest platform open for all creative individuals passionate about art and creativity.</Text>
                                    <Text><Text style={{ color: "#000" }}>b.</Text> Artists and Students are provided with the opportunity to showcase their artwork through online exhibition.</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={style.subHead}>2. How to participate in Global Art exhibition?</Text>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text><Text style={{ color: "#000" }}>a.</Text> Visit www.kcaindia.com or download the KCA App.</Text>
                                    <Text><Text style={{ color: "#000" }}>b.</Text> Sign in to your account.</Text>
                                    <Text><Text style={{ color: "#000" }}>c.</Text> Navigate to the section labeled <Text style={{ fontWeight: "bold" }}>"Global Art Exhibition,"</Text> typically found on the homepage</Text>
                                    <Text><Text style={{ color: "#000" }}>d.</Text> Look for the option for individual registration and click on it</Text>
                                    <Text><Text style={{ color: "#000" }}>e.</Text> Fill out the required details in the registration form.</Text>
                                    <Text><Text style={{ color: "#000" }}>f.</Text> After completing the registration form, submit it.</Text>
                                    <Text><Text style={{ color: "#000" }}>g.</Text> Once the submission is successful, you can view all the details related to your participation inside your dashboard.</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={style.faqHead}>FOR PARENTS</Text>
                            <View>
                                <Text style={style.subHead}>1. How my child can participate in National Talent Search Drawing and Painting Scholarship Competition-2025?</Text>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text><Text style={{ color: "#000" }}>a.</Text> Visit the website www.kcaindia.com or download the KCA App.</Text>
                                    <Text><Text style={{ color: "#000" }}>b.</Text> Sign in to your account.</Text>
                                    <Text><Text style={{ color: "#000" }}>c.</Text> On the homepage, navigate to the 3rd image labeled <Text style={{ fontWeight: "bold" }}>"FOR PARENTS."</Text></Text>
                                    <Text><Text style={{ color: "#000" }}>d.</Text> Click on  <Text style={{ fontWeight: "bold" }}>"Provide Information."</Text></Text>
                                    <Text><Text style={{ color: "#000" }}>e.</Text> Follow the link provided to fill out the form with the required details</Text>
                                    <Text><Text style={{ color: "#000" }}>f.</Text> After providing the necessary information, KCA will send a brochure of the National Talent Search Drawing and Painting Scholarship Competition-2025 to the schools listed as the provided school correspondence address.</Text>
                                </View>
                            </View>
                            <View style={{ marginBottom: 25 }}>
                                <Text style={style.subHead}>2. Who can fill out the registration form and who can participate?</Text>
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text><Text style={{ color: "#000" }}>a.</Text> Only School Principals, Art Teachers, or any School Authority are authorized to fill the School Registration Form for the National Talent Search Drawing and Painting Scholarship Competition-2025. They will receive all the necessary details after submitting the registration form.</Text>
                                    <Text><Text style={{ color: "#000" }}>b.</Text> Students from Nursery to Class 10th from registered schools in KCA are eligible to participate in their respective schools. Parents or students themselves are not allowed to fill out the registration form.</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}

export default HelpScreen