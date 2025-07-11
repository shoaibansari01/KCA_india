import { Dimensions, StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from "react-native-responsive-dimensions";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const style: any = StyleSheet.create({
    // Text size styles
    fs10: {
        fontSize: responsiveFontSize(1.16),
    },
    fs12: {
        fontSize: responsiveFontSize(1.392),
    },
    fs14: {
        fontSize: responsiveFontSize(1.624),
    },
    fs16: {
        fontSize: responsiveFontSize(1.856),
    },
    fs18: {
        fontSize: responsiveFontSize(2.088),
    },
    fs20: {
        fontSize: responsiveFontSize(2.32),
    },
    fs22: {
        fontSize: responsiveFontSize(2.552),
    },
    fs24: {
        fontSize: responsiveFontSize(2.784),
    },
    fs26: {
        fontSize: responsiveFontSize(3.016),
    },
    fs28: {
        fontSize: responsiveFontSize(3.248),
    },
    fs30: {
        fontSize: responsiveFontSize(3.48),
    },
    fs40: {
        fontSize: responsiveFontSize(4.64),
    },

    // Text waight styles
    boldText: {
        fontWeight: 'bold',
    },
    semiBoldText: {
        fontWeight: '600',
    },
    mediumText: {
        fontWeight: '500',
    },
    normalText: {
        fontWeight: 'normal',
    },
    lightText: {
        fontWeight: '300',
    },
    extraLightText: {
        fontWeight: '200',
    },
    thinText: {
        fontWeight: '100',
    },

    // Text color styles
    textColorBlack: {
        color: '#000',
    },
    textColorPrimary: {
        color: '#001B47',
    },
    textColorSecondary: {
        color: 'gray',
    },
    textColorAccent: {
        color: 'blue',
    },
    textColorError: {
        color: 'red',
    },
    textColorSuccess: {
        color: 'green',
    },
    textColorLight: {
        color: '#fff',
    },

    // Background color styles
    backgroundColorPrimary: {
        backgroundColor: 'white',
    },
    backgroundColorSecondary: {
        backgroundColor: 'lightgray',
    },
    backgroundColorAccent: {
        backgroundColor: 'blue',
    },
    backgroundColorError: {
        backgroundColor: 'red',
    },
    backgroundColorSuccess: {
        backgroundColor: 'green',
    },
    homeScreen: {
        backgroundColor: '#fff',
        height: windowHeight,
        justifyContent: "center",
        alignItems: "center"
    },
    submitButton: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        paddingVertical: 15,
        margin: "auto",
        paddingHorizontal: 30,
        backgroundColor: "#93278f",
        borderRadius: 15,
        width: 150
    },
    gallaryCard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        // marginBottom: 20,
        item: {
            width: responsiveWidth(42),
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginTop: 12
        },
        gallaryCardHeader: {
            color: "#001B47",
            fontSize: responsiveFontSize(1.74),
            fontWeight: "600",
            marginVertical: 3

        },
        gallaryCardDetails: {
            fontSize: responsiveFontSize(1.392),
            color: "#0D253C",
        }
    },
    gallaryVideoCard: {
        width: responsiveWidth(100),
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20
    },
    gallaryVideoCardItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        paddingHorizontal: 20,
        marginLeft: 15,
        marginBottom: 15
    },
    // Splash Screen Text
    splashScreenTxt: {
        fontSize: responsiveFontSize(2.4),
        fontWeight: "bold",
        color: "#93278f",
        marginTop: responsiveHeight(2),
        textAlign: "center"
    },
    // Border color styles
    borderColorPrimary: {
        borderColor: 'black',
    },
    borderColorSecondary: {
        borderColor: 'gray',
    },
    borderColorAccent: {
        borderColor: 'blue',
    },
    borderColorError: {
        borderColor: 'red',
    },
    borderColorSuccess: {
        borderColor: 'green',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    dynamicText: {
        fontSize: windowWidth > 400 ? 20 : 16,
    },
    selectBox: {
        padding: 10
    },
    selectLabel: {
        color: '#001B47',
        marginBottom: 8,
        fontWeight: "bold",
        fontSize: responsiveFontSize(1.856)
    },
    singnInTitle: {
        color: 'black',
        fontSize: responsiveFontSize(3.5),
        fontWeight: 'bold',
        marginVertical: 70,
        paddingStart: 10
    },
    singnUpTitle: {
        color: 'black',
        fontSize: responsiveFontSize(3.48),
        fontWeight: 'bold',
        marginVertical: 15,
        paddingStart: 10
    },
    formGroup: {
        backgroundColor: '#F4F4F4',
        borderBottomWidth: 0,
        fontSize: responsiveFontSize(1.856)
    },
    studentCountInput: {

    },
    stdEditCountInput: {

    },
    forgetButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    placeholderStyle: {
        fontSize: responsiveFontSize(5.8),
        color: 'red'
    },
    signBtn: {
        backgroundColor: "#93278f",
        width: 100
    },
    circleIcon: {
        backgroundColor: "#93278f",
        width: 32,
        height: 32,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    checkedIcon: {
        backgroundColor: "#00a884",
        width: 20,
        height: 20,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    circleIconBig: {
        backgroundColor: "#93278f",
        width: 70,
        height: 70,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    profileCircleIcon: {
        backgroundColor: "#93278f",
        width: 50,
        height: 50,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20
    },
    cardBody: {
        backgroundColor: "#CDDFFF",
        marginVertical: 10,
        padding: 15,
        borderRadius: 5,
        textAlign: "center",
        // cardImg: {
        //     // width: '100%',
        //     margin: 0,
        //     overflow: "hidden",
        // }

    },
    cardBodyText: {
        color: "#001B47",
        fontSize: responsiveFontSize(1.856),
        marginVertical: 10
    },
    orText: {
        color: '#93278f',
        fontSize: responsiveFontSize(2.32),
        marginTop: 15,
        marginBottom: 35,
        textAlign: "center",
        fontWeight: "600"
    },
    registerLink: {
        color: '#93278f',
        textAlign: "right",
        fontWeight: "600",
    },
    moreDtls: {
        backgroundColor: '#93278f',
        textAlign: 'center',
        padding: 8,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        text: {
            color: "#fff",
            fontSize: responsiveFontSize(2.32),
            textAlign: "center",
        }
    },
    userOptDtls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingStart: 40,
        paddingVertical: 20,
        text: {
            fontSize: responsiveFontSize(1.856),
            color: "#001B47",
            marginRight: 10
        },
        subText: {
            fontSize: responsiveFontSize(1.6),
            color: "#001B47",
            marginRight: 10
        }
    },
    blackDots: {
        height: 12,
        width: 12,
        borderRadius: 10,
        backgroundColor: '#130F26',
        flexDirection: "row",
        marginRight: 5
    },
    redDots: {
        height: 14,
        width: 14,
        borderRadius: 10,
        backgroundColor: '#93278f',
        flexDirection: "row",
        marginRight: 5
    },
    pageHeading: {
        textAlign: "center",
        fontSize: responsiveFontSize(3.016),
        fontWeight: "bold",
        color: "#000"
    },
    pageSubHead: {
        textAlign: "center",
        fontSize: responsiveFontSize(1.856),
        marginTop: 15,
        color: "#001B47",
        fontWeight: "bold",
    },
    filter: {
        backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    filterFormGroup: {
        borderBottomColor: "none",
        fontSize: responsiveFontSize(1.856),
    },
    participentformImg: {
        width: "100%",
        marginVertical: 7
    },
    participentFeesHead: {
        color: "#001B47",
        fontSize: responsiveFontSize(2.32),
        marginBottom: 10
    },
    stdParticipentHead: {
        color: "#93278f",
        fontWeight: "bold",
        fontSize: responsiveFontSize(2.552),
        marginVertical: 20
    },
    stdParticipentText: {
        color: "#001B47",
        fontSize: responsiveFontSize(2.204),
        marginVertical: 10
    },
    participentSelect: {
        color: "#001B47",
        fontSize: responsiveFontSize(2.088),
        marginVertical: 10
    },
    participentFees: {
        color: "#93278f",
        fontSize: responsiveFontSize(2.552),
        fontWeight: "bold",
    },
    horizontalLine: {
        borderBottomColor: '#222222',
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 10,
    },
    dividerfinalFees: {
        borderBottomColor: '#2222224a',
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 10,
    },
    participentList: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10
    },
    participentClass: {
        color: "#0D253C",
        fontSize: responsiveFontSize(1.856),
        fontWeight: "bold",
    },
    fees: {
        color: "#0D253C",
        fontSize: responsiveFontSize(1.74),
        marginTop: 5
    },
    actionOtp: {
        color: "#001B47",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    confirmEntrySec: {
        marginTop: "5%"
    },
    confirmEntryCard: {
        backgroundColor: "#CDDFFF",
        padding: 15,
        marginVertical: 10
    },
    finalFeeConfCard: {
        padding: 15,
        marginVertical: 10
    },
    confirmEntryCardHead: {
        color: "#001B47",
        fontSize: responsiveFontSize(2.32),
        fontWeight: "bold",
    },
    confirmEntryCardDetails: {
        color: "#001B47",
        fontSize: responsiveFontSize(1.856),
        fontWeight: "bold",
    },
    totalFinalFees: {
        color: "#93278f",
        fontSize: responsiveFontSize(1.856),
        fontWeight: "bold",
    },
    confirmEntryCardDetailsTotal: {
        color: "#93278f",
        fontSize: responsiveFontSize(1.856),
        fontWeight: "bold",
    },
    termAndCond: {
        backgroundColor: "#D9D9D9",
        padding: 5,
        alignItems: "center",
        marginVertical: 10,
        borderRadius: 10,
        head: {
            fontSize: responsiveFontSize(1.9),
            color: "#001B47",
        },
        subHead: {
            fontSize: responsiveFontSize(1.624),
            color: "#001B47",
        },
        data: {
            padding: 10,
            head: {
                color: "#93278f",
                fontWeight: "bold",
            },
            content: {
                color: "#001B47",
                fontWeight: 'normal',
            },

        }
    },
    brochureInfo: {
        head: {
            alignItems: "center",
            mainHead: {
                color: "#93278f",
                fontSize: responsiveFontSize(2.2),
                fontWeight: "bold",
                padding: 10
            },
        },
        data: {
            fontSize: responsiveFontSize(1.856),
            color: "#001B47",
            marginBottom: 10,
        },
        acessText: {
            fontSize: responsiveFontSize(1.856),
            color: "#001B47",
            marginBottom: 10,
        },
        brochureLink: {
            color: "#93278f",
            fontWeight: "bold",
            marginEnd: 10
        }
    },
    parentSec: {
        marginVertical: 15,
        marginHorizontal: 5,
        parentInstruction: {
            fontSize: responsiveFontSize(1.856),
            color: "#001B47",
            marginBottom: 10
        }
    },
    drawerContainerModal: {
        height: responsiveHeight(100),
        backgroundColor: '#fff'
    },
    tabBarStyle: {
        height: responsiveScreenHeight(10),
        paddingBottom: responsiveHeight(2),
        paddingTop: responsiveHeight(1),
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    tabLabelStyle: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'Roboto-Medium',
        marginBottom: 10
    },
    drawerView: {
        flex: .20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15
    },
    settingAvtarName: {
        fontSize: responsiveFontSize(2.5),
        color: '#182036',
        fontFamily: 'Roboto-Medium',
        marginTop: responsiveWidth(2.5),
        marginLeft: responsiveWidth(4)
    },
    uploaddataHead: {
        color: "#001B47",
        fontSize: responsiveFontSize(2.32),
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 8,
        textAlign: "center"
    },
    artWorkText: {
        // color: "#001B47",
        fontSize: responsiveFontSize(1.60),
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: "center"
    },
    preChosenArtWorkText: {
        color: "#001B47",
        fontSize: responsiveFontSize(1.60),
        marginVertical: 5,
        fontWeight: "bold",
        textAlign: "center"
    },
    uploaddataSubHead: {
        color: "#001B47",
        fontSize: responsiveFontSize(2.088),
        fontWeight: "bold",
        marginBottom: 20
    },
    uploaddatadashBorder: {
        borderWidth: 1,
        borderRadius: 7,
        borderStyle: 'dashed',
        borderColor: '#93278f',
        position: 'relative',
    },
    anchorLinkAccent: {
        fontWeight: "500",
        fontSize: responsiveFontSize(2),
        color: "#93278f",
        marginVertical: 10,
        textDecorationLine: "underline"
    },
    uploaddataDragDrop: {
        color: "#001b4794",
        fontSize: responsiveFontSize(2.088),
        fontWeight: "bold",
        textAlign: "center"
    },
    uploaddataDragDropText: {
        color: "#001b4794",
        fontSize: responsiveFontSize(2.088),
        textAlign: "center",
        marginTop: 6
    },
    abouttext: {
        fontSize: responsiveFontSize(1.856),
        textAlign: "justify"
    },
    row: {
        flexDirection: "row",
        marginBottom: 10,
        // marginLeft:20
    },
    detailsHead: {
        marginRight: 20,
        fontSize: responsiveFontSize(2.088),
        color: "#130F26",
        fontWeight: "bold",
    },
    detailsValue: {
        // flex: 2,
        fontSize: responsiveFontSize(2.088),
        color: "#93278f",
    },
    googleFormRedirect: {
        fontSize: responsiveFontSize(2.088),
        fontWeight: "bold",
        color: "#93278f",
    },
    detailsVideoSec: {
        backgroundColor: "#dedada",
        height: responsiveHeight(20),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    clickHere: {
        fontSize: responsiveFontSize(1.508),
        marginEnd: 10,
        color: "#93278f"
    },
    otpResend: {
        marginStart: 10,
        fontSize: responsiveFontSize(1.74),
        color: "#93278f",
        fontWeight: "bold"
    },
    otpHead: {
        fontSize: responsiveFontSize(1.74),
        color: "#001B47"
    },
    comntSec: {
        paddingVertical: 20,
        height: responsiveHeight(30)
    },
    scrollViewContent: {
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        flexGrow: 1,
    },
    incommingCmnt: {
        backgroundColor: "#CDDFFF",
        padding: 10,
        paddingLeft: 20,

        borderRadius: 20,
        borderTopLeftRadius: 0,
    },
    pills: {
        backgroundColor: "#CDDFFF",
        padding: 10,
        paddingLeft: 20,
        borderRadius: 20,
        flexDirection: "row",
        // justifyContent:"space-between",  
        alignItems: "center"
    },
    outgoingCmnt: {
        backgroundColor: "#CDDFFF",
        padding: 10,
        // marginTop: 10,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
        borderRadius: 20,
        borderTopRightRadius: 0,
    },
    errorText: {
        color: 'red',
        fontSize: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    faqSec: {
        // marginVertical:10,
        marginBottom: 30
    },
    faqHead: {
        fontSize: 14,
        color: "#93278f",
        fontWeight: "600",
        marginVertical: 10
    },
    subHead: {
        fontSize: 14,
        color: "#000",
        marginVertical: 5
    },
    content: {
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    colapsHead: {
        fontSize: 14,
        color: "#000",
        fontWeight: "500"
    },
    colapsHeadcount: {
        color: "#93278f"
    },
    videoInUplod: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    blockBtn: {
        borderRadius: 5,
        backgroundColor: "#dc3545",
        paddingVertical: 3,
        paddingHorizontal: 10,

    },
    unBlockBtn: {
        borderRadius: 5,
        backgroundColor: "#28a745",
        paddingVertical: 3,
        paddingHorizontal: 10,

    },
    blockBtnText: {
        fontWeight: "bold",
        color: "#fff",
    },
    notificationList: {
        borderRadius: 8,
        backgroundColor: "#CDDFFF",
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    userKey: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold"
    },
    userValue: {
        fontSize: 18,
        marginLeft: 10,
        color: "#93278f",
        fontWeight: "bold",
    },
    rectangles: {
        backgroundColor: "#93278f",
        padding: 20,
        marginVertical: 10,
        width: "90%",
        alignItems: "center",
        borderRadius: 15,
    },
    rectanglesText: {
        color: "#fff",
        fontWeight: "bold"
    },
    nomination: {
        heading: {
            fontSize: 20,
            color: "#001B47",
            fontWeight: 500,
            textAlign: "center",
            // marginTop: 10,
            marginBottom: 10
        },
        subKey: {
            fontSize: responsiveFontSize(2.1),
            color: "#001B47",
            textAlign: "center",
            marginBottom: 10,
            fontWeight: 500,
        },
        subHead: {
            fontSize: responsiveFontSize(2.1),
            color: "#001B47",
            marginBottom: 10,
            fontWeight: 500,
        },
        intro: {
            fontSize: responsiveFontSize(1.856),
            color: "#001B47",
            marginBottom: 10,
            textAlign: "justify"

        },
        text: {
            color: "#444444"
        },
        boldText: {
            fontWeight: 500,
            color: "#000"
        }
    }


})