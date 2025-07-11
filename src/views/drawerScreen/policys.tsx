import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { responsiveFontSize } from 'react-native-responsive-dimensions'

const Policys = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                    <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Policys</Text>
                </TouchableOpacity>
                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: responsiveFontSize(2.784), color: "#93278f", marginVertical: 10, fontWeight: "bold", }}>Privacy Policy</Text>
                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Who we are</Text>
                        <Text style={style.abouttext}>Suggested text: Our website address is: https://kcaindia.com</Text>
                        <Text style={style.abouttext}>Privacy Policy: https://www.kcaindia.com/privacy_policy</Text>
                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Comments</Text>
                        <Text style={style.abouttext}>Suggested text: When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.</Text>
                        <Text style={style.abouttext}>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Media</Text>
                        <Text style={style.abouttext}>Suggested text: If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Cookies</Text>
                        <Text style={style.abouttext}>Suggested text: If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</Text>
                        <Text style={style.abouttext}>If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</Text>
                        <Text style={style.abouttext}>When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select “Remember Me”, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</Text>
                        <Text style={style.abouttext}>If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Embedded content from other websites</Text>
                        <Text style={style.abouttext}>Suggested text: Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</Text>
                        <Text style={style.abouttext}>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Who we share your data with</Text>
                        <Text style={style.abouttext}>Suggested text: If you request a password reset, your IP address will be included in the reset email.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>How long we retain your data</Text>
                        <Text style={style.abouttext}>Suggested text: If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                        </Text>
                        <Text style={style.abouttext}>
                            For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>What rights you have over your data</Text>
                        <Text style={style.abouttext}>Suggested text: If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}> Where your data is sent</Text>
                        <Text style={style.abouttext}>Suggested text: Visitor comments may be checked through an automated spam detection service.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.784), color: "#93278f", marginBottom: 10, marginTop: 20, fontWeight: "bold" }}>Refund and Cancellation Policy</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Refund Policy</Text>
                        <Text style={style.abouttext}>Fees collected will not be refunded. Students who withdraw from the School  during the term will not be given Refund. The fees will be forfeited and is non-refundable and non-transferable. However, KCA will take the final call for Refund in Special Cases.</Text>
                        <Text style={style.abouttext}>Admissions will not be confirmed until registration is complete and fee is received in full.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Cancellation Policy</Text>
                        <Text style={style.abouttext}>KCA reserves the right to cancel any admission due to insufficient enrolment.KCA is not responsible for any expenses incurred by the Parent / Guardian / Student if the admission is cancelled.</Text>

                        <Text style={{ fontSize: responsiveFontSize(2.32), color: "#000", marginVertical: 10 }}>Acceptance of this Refund Policy</Text>
                        <Text style={style.abouttext}>It is your responsibility to familiarize yourself with this refund policy. By paying any Fees via online, you indicate that you have read this refund policy and that you agree with and fully accept the terms of this refund policy.</Text>
                        <Text style={style.abouttext}>If you do not agree with or fully accept the terms of this refund policy, we ask that you do not pay us the Fees.</Text>
                        <Text style={style.abouttext}>Please contact KCA at 7770016545, 7796613273 or email at info@kcaindia.com, kcaindia.com@gmail.com if you have any questions.</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}

export default Policys