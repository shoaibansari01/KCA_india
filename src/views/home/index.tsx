import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {style} from '../../style/style';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import Header from '../../components/header';
import {postReq} from '../../helper/http';
import {AuthContext} from '../../helper/contex';
import {s3PreFixUrl} from '../../helper/routes';
import {ActivityIndicator} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {AnimatedIcon} from '../../components/animatedIcon';
import Slider from '../../components/slider';
import {AnimatedText} from '../../components/animatedText';
import ImageModal from 'react-native-image-modal';
import ResultPage from '../../components/resultPage';

export const cardsMappped = [
  {
    title:
      'NATIONAL TALENT SEARCH DRAWING AND PAINTING SCHOLARSHIP COMPETITION 2025 (Open for Nursery to class 10th Students)',
    formType: '',
    img: 'homepage/national.png',
    level: 'national',
    actionTxt: 'School Registration',
    redirect: 'RegistrationForm',
  },
  {
    title:
      'Global Art Exhibition (Online Platform Open For All Creative Individuals Passionate About Art And Creativity)',
    formType: '',
    img: 'homepage/global.png',
    level: 'global',
    actionTxt: 'Individual Registration',
    redirect: 'RegistrationForm',
  },
  {
    title: 'National Kids Achievers Genius Awards (For 3 to 18 years)',
    formType: '',
    img: 'homepage/kidsAchiversGeniusAward.JPG',
    actionTxt: 'Nomination Form',
    redirect: 'NominationForm',
  },
];

const HomeScreen = ({props, navigation}: any) => {
  const {authData}: any = useContext(AuthContext);
  const [preRegisterUser, setPreRegisterUser]: any = useState({
    nationalUser: {},
    globalUser: {},
  });
  const [loader, setLoader] = useState(false);
  const [bannerLoader, setBannerLoader] = useState(false);
  const [bannerState, setBannerState] = useState(true);
  const [bannerData, setBannerData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clickedImagePath, setClickedImagePath] = useState('');

  const toggleModal = () =>
    navigation.navigate('WebviewScreen', {
      url: 'homepage/VID-20240708-WA0002.mp4',
    });

  const getBanner = async () => {
    setBannerLoader(true);
    const res = await postReq({
      url: 'get-banners',
      returnKey: 'data',
    });
    // console.log(res,'resresres')
    res && setBannerData(res);
    setBannerLoader(false);
  };

  const checkGLobalUser = async () => {
    setLoader(true);
    const res = await postReq({
      url: 'check-global-register',
      data: {
        userId: authData?.user?.userId,
      },
      returnKey: 'authdata',
    });
    res &&
      setPreRegisterUser({
        nationalUser: res?.nationalUser,
        globalUser: res?.globalUser,
      });
    setLoader(false);
  };

  const checkRegistration = async (level: any, redirect: any) => {
    if (redirect == 'NominationForm') navigation.navigate(redirect);
    if (redirect != 'NominationForm') {
      const _ = await postReq({
        url: 'check-register',
        data: {
          userId: authData?.user?.userId,
          formType: level == 'global' ? 'G' : 'N',
        },
        returnKey: 'authdata',
      });
      if (_?.isVerified) {
        navigation.navigate('UserDashboard', {data: {values: {..._}, level}});
      } else {
        navigation.navigate(redirect, {data: level});
      }
    }
  };

  const handleImagePress = (data: any, idx: any) => {
    Linking.openURL(data?.banner_link);
  };

  const handleVideoPress = (data: any, idx: any) => {
    navigation.navigate('WebviewScreen', {
      url: data?.uploadedFile,
    });
  };

  const newGlobalRegistration = async (level: any, redirect: any) => {
    navigation.navigate(redirect, {data: level});
  };

  const handleZoom = (path: any) => {
    setClickedImagePath(`${s3PreFixUrl}${path}`);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setClickedImagePath('');
  };

  useEffect(() => {
    getBanner();
    checkGLobalUser();
  }, []);

  return (
    <SafeAreaView style={{marginBottom: 20}}>
      <Header />
      <ScrollView
        style={{marginBottom: 30}}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
          {/* <TouchableOpacity >
                        <View style={{ backgroundColor: "#CDDFFF", paddingVertical: 20, alignItems: "center", marginTop: 10, borderRadius: 10, flexDirection: "column", height: responsiveHeight(11) }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[style.fs20, style.boldText, style.textColorBlack]}>WELCOME TO KCA</Text>
                            </View>
                            <View style={{ marginBottom: 10, position: 'relative', alignItems: "center" }}>
                                <Text style={[style.fs16, style.boldText, style.textColorBlack]}>Watch Video of KCA</Text>
                                <View style={{ position: "absolute", opacity: 0.5, top: -8 }}>
                                    <AnimatedIcon name="smart-display" color="#93278f" size={40} />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity> */}
          {/* <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 7 }}>
                        <View>
                            <Slider  {...{ data: bannerData, handleImagePress, handleVideoPress }} />
                        </View>
                    </View>  */}

          {bannerState ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: responsiveHeight(70),
              }}>
              {[
                `National Talent Search Drawing and Painting Scholarship Competition (For Nursery to class 10th students)`,
                `Global Art Exhibition (Open For All)`,
                `National Kids Achievers Genius Awards (For 3 to 18 yrs)`,
              ].map((e, i) => (
                <TouchableOpacity
                  style={style.rectangles}
                  onPress={() => setBannerState(false)}>
                  {/* <AnimatedText name={e} /> */}
                  <Text style={style.rectanglesText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View>
              {loader ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: responsiveHeight(80),
                  }}>
                  <ActivityIndicator size="small" color="#93278f" />
                </View>
              ) : (
                <>
                  <View style={{}}>
                    <View>
                      <ResultPage />
                    </View>
                  </View>
                  {cardsMappped?.map(
                    ({title, actionTxt, formType, img, level, redirect}, i) => (
                      <View style={style.cardBody} key={i}>
                        <TouchableOpacity onPress={() => handleZoom(img)}>
                          <View
                            style={{
                              width: '100%',
                              height: 186,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Image
                              style={[
                                style.cardBody.cardImg,
                                {
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'fill',
                                },
                              ]}
                              source={{uri: `${s3PreFixUrl}${img}`}}
                            />
                          </View>
                        </TouchableOpacity>
                        {img ? (
                          <Text style={style.cardBodyText}>{title}</Text>
                        ) : (
                          <View
                            style={{
                              backgroundColor: '#D9D9D9',
                              padding: 50,
                              alignItems: 'center',
                              marginTop: 10,
                              borderRadius: 10,
                              marginBottom: 10,
                            }}>
                            <Text
                              style={[
                                style.fs18,
                                style.boldText,
                                style.textColorBlack,
                              ]}>
                              {title}
                            </Text>
                          </View>
                        )}
                        {i == 2 ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: `${
                                preRegisterUser?.globalUser?._id
                                  ? 'space-between'
                                  : 'flex-end'
                              }`,
                            }}>
                            {preRegisterUser?.globalUser?._id && (
                              <TouchableOpacity
                                onPress={() => {
                                  newGlobalRegistration(level, redirect);
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <Text style={style.registerLink}>
                                    Individual Registration
                                  </Text>
                                  <Icon
                                    name="keyboard-arrow-right"
                                    color="#93278f"
                                    size={25}
                                  />
                                </View>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              onPress={() => {
                                checkRegistration(level, redirect);
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                }}>
                                <Text style={style.registerLink}>
                                  {preRegisterUser?.globalUser?._id
                                    ? 'My Dashboard'
                                    : 'Individual Registration'}
                                </Text>
                                <Icon
                                  name="keyboard-arrow-right"
                                  color="#93278f"
                                  size={25}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : i == 1 ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: `${
                                preRegisterUser?.nationalUser?._id
                                  ? 'space-between'
                                  : 'flex-end'
                              }`,
                            }}>
                            {preRegisterUser?.nationalUser?._id && (
                              <TouchableOpacity
                                onPress={() => {
                                  newGlobalRegistration(level, redirect);
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <Text style={style.registerLink}>
                                   Individual Registration
                                  </Text>
                                  <Icon
                                    name="keyboard-arrow-right"
                                    color="#93278f"
                                    size={25}
                                  />
                                </View>
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              onPress={() => {
                                checkRegistration(level, redirect);
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                }}>
                                <Text style={style.registerLink}>
                                  {preRegisterUser?.nationalUser?._id
                                    ? 'My Dashboard'
                                    : 'Individual Registration'}
                                </Text>
                                <Icon
                                  name="keyboard-arrow-right"
                                  color="#93278f"
                                  size={25}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              checkRegistration(level, redirect);
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}>
                              <Text style={style.registerLink}>
                                {actionTxt ?? 'Individual Registration'}
                              </Text>
                              <Icon
                                name="keyboard-arrow-right"
                                color="#93278f"
                                size={25}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    ),
                  )}
                </>
              )}
            </View>
          )}

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeModal}>
            <View style={styles.modalBackground}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Icon name="close" size={30} color="#fff" />
              </TouchableOpacity>
              <View style={styles.card}>
                <View>
                  <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#fff"
                    style={{
                      width: 250,
                      height: 250,
                    }}
                    source={{
                      uri: clickedImagePath,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30,
  },
  card: {
    height: '100%',
    // backgroundColor: "red",
    flexDirection: 'column',
    justifyContent: 'center',
    // flex:1
  },
  operation: {
    marginTop: 20,
  },
});

export default HomeScreen;
