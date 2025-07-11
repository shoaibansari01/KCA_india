import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { style } from '../../style/style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from 'react-native-elements/dist/icons/Icon'

const Profile = () => {
    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => console.log('back btn')}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
                            <Text style={[style.fs18, style.boldText, style.textColorBlack]}>Profile</Text>
                        </View>
                    </TouchableOpacity>
                    <Icon name="notifications-none" color="#130F26" size={30} />
                </View>

                <View style={{ marginVertical: 30, flexDirection: "row", marginHorizontal: 20 }}>
                    <View style={style.profileCircleIcon}>
                        <Icon name="person-outline" color="#fff" size={25} />
                    </View>
                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                        <Text style={[style.fs24, style.boldText, style.textColorBlack]}>Swapnil M</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 5 }}>
                            <Text style={style.registerLink}>View Profile</Text>
                            <Icon name="keyboard-arrow-right" color="#93278f" size={25} />
                        </View>
                    </View>
                </View>

                <HorizontalLine />

                <View style={{ paddingHorizontal: 20 }}>
                    {[{ icon: "favorite-outline", name: "My Favorites", redirect: "Favourite" }, { icon: "dashboard", name: "My Dashboard", redirect: "" }, { icon: "shopping-cart", name: "My Cart", redirect: "" }, { icon: "contact-page", name: "Certificate", redirect: "" }, { icon: "payment", name: "Payment Details", redirect: "" }, { icon: "feedback", name: "Feedback", redirect: "" }, { icon: "ads-click", name: "Ads", redirect: "" }, { icon: "favorite-outline", name: "About KCA", redirect: "" },
                    { icon: "favorite-outline", name: "Term & Condition", redirect: "" },
                    { icon: "support", name: "Support", redirect: "" },
                    { icon: "settings", name: "Setting", redirect: "" },
                    { icon: "logout", name: "Logout", redirect: "" }].map(({ icon, name, redirect }, i) =>
                        <TouchableOpacity key={i} onPress={() => console.log('back btn')}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }} key={i}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon name={icon} color="#93278f" size={25} style={{ marginRight: 20 }} />
                                    <Text style={[style.fs18, style.textColorPrimary, style.semiBoldText]}>{name}</Text>
                                </View>
                                <Icon name="keyboard-arrow-right" color="#93278f" size={28} />
                            </View></TouchableOpacity>
                    )}

                </View>
            </View>
        </SafeAreaView>
    )
}

export const HorizontalLine = () => <View style={{ height: 1, backgroundColor: 'black', marginBottom: 20 }} />

export default Profile