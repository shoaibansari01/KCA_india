import React, { useContext, useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { style } from '../../style/style';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Header from '../../components/header';
import { postReq } from '../../helper/http';
import { AuthContext } from '../../helper/contex';
import { s3PreFixUrl } from '../../helper/routes';
import { ActivityIndicator } from 'react-native-paper';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { AnimatedIcon } from '../../components/animatedIcon';
import Slider from '../../components/slider';
import { AnimatedText } from '../../components/animatedText';
import ImageModal from 'react-native-image-modal';
import ResultPage from '../../components/resultPage';

// Updated ageOptions for ages 3 to 15
const ageOptions = Array.from({ length: 13 }, (_, i) => ({
  value: (i + 3).toString(),
  label: `${i + 3} year${i + 3 > 1 ? 's' : ''}`,
}));

// Updated classOptions with new labels
const classOptions = [
  { value: 'PreNursery', label: 'Nursery' },
  { value: 'Nursery', label: 'Nursery' },
  { value: 'LKG', label: 'KG-1 & KG-2' },
  { value: 'UKG', label: 'KG-1 & KG-2' },
  { value: 'Class1', label: '1st & 2nd' },
  { value: 'Class2', label: '1st & 2nd' },
  { value: 'Class3', label: '3rd & 4th' },
  { value: 'Class4', label: '3rd & 4th' },
  { value: 'Class5', label: '5th & 6th' },
  { value: 'Class6', label: '5th & 6th' },
  { value: 'Class7', label: '7th & 8th' },
  { value: 'Class8', label: '7th & 8th' },
  { value: 'Class9', label: '9th & 10th' },
  { value: 'Class10', label: '9th & 10th' },
];

export const cardsMappped = [
  {
    title: 'National All-Rounder Talent Hub Contests (For 3 years to 15 years)',
    formType: '',
    img: 'homepage/allrounder.png',
    level: 'allrounder',
    actionTxt: 'Individual Registration',
    redirect: 'AllRounderContestInfo',
  },
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
    actionTxt: 'Individual Registration',
    redirect: 'NominationForm',
  },
];

const HomeScreen = ({ props, navigation }: any) => {
  const { authData }: any = useContext(AuthContext);
  const [preRegisterUser, setPreRegisterUser]: any = useState({
    nationalUser: {},
    globalUser: {},
    allrounderUser: {},
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
        allrounderUser: res?.allrounderUser,
      });
    setLoader(false);
  };

  const checkRegistration = async (level: any, redirect: any) => {
    if (redirect === 'NominationForm') {
      navigation.navigate(redirect);
      return;
    }
    if (redirect === 'AllRounderContestInfo' || redirect === 'AllRounderForm' || level === 'allrounder') {
      if (preRegisterUser?.allrounderUser?._id) {
        navigation.navigate('UserDashboard', {
          data: {
            values: { ...preRegisterUser.allrounderUser },
            level: 'allrounder',
          },
        });
      } else {
        navigation.navigate(redirect);
      }
      return;
    }
    const _ = await postReq({
      url: 'check-register',
      data: {
        userId: authData?.user?.userId,
        formType: level === 'global' ? 'G' : level === 'national' ? 'N' : level === 'allrounder' ? 'A' : 'N',
      },
      returnKey: 'authdata',
    });
    if (_?.isVerified) {
      navigation.navigate('UserDashboard', { data: { values: { ..._ }, level } });
    } else {
      navigation.navigate(redirect, { data: level });
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
    navigation.navigate(redirect, { data: level });
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
    <SafeAreaView style={{ marginBottom: 20 }}>
      <Header />
      <ScrollView style={{ marginBottom: 30 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          {bannerState ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: responsiveHeight(70),
              }}>
              {[
                'National All-Rounder Talent Hub Contests (For Nursery to Class 10th Students)',
                `National Talent Search Drawing and Painting Scholarship Competition (For Nursery to class 10th students)`,
                `Global Art Exhibition (Open For All)`,
                `National Kids Achievers Genius Awards (For 3 to 18 yrs)`,
              ].map((e, i) => (
                <TouchableOpacity
                  style={style.rectangles}
                  onPress={() => setBannerState(false)}
                  key={i}>
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
                    ({ title, actionTxt, formType, img, level, redirect }, i) => (
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
                              source={{ uri: `${s3PreFixUrl}${img}` }}
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
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: `${
                              (i === 0 && preRegisterUser?.allrounderUser?._id) ||
                              (i === 1 && preRegisterUser?.nationalUser?._id) ||
                              (i === 2 && preRegisterUser?.globalUser?._id)
                                ? 'space-between'
                                : 'flex-end'
                            }`,
                          }}>
                          {(i === 0 && preRegisterUser?.allrounderUser?._id) ||
                          (i === 1 && preRegisterUser?.nationalUser?._id) ||
                          (i === 2 && preRegisterUser?.globalUser?._id) ? (
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
                                <Text style={style.registerLink}>{actionTxt}</Text>
                                <Icon name="keyboard-arrow-right" color="#93278f" size={25} />
                              </View>
                            </TouchableOpacity>
                          ) : null}
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
                                {i === 0 && preRegisterUser?.allrounderUser?._id
                                  ? 'My Dashboard'
                                  : i === 1 && preRegisterUser?.nationalUser?._id
                                  ? 'My Dashboard'
                                  : i === 2 && preRegisterUser?.globalUser?._id
                                  ? 'My Dashboard'
                                  : actionTxt}
                              </Text>
                              <Icon name="keyboard-arrow-right" color="#93278f" size={25} />
                            </View>
                          </TouchableOpacity>
                        </View>
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
    flexDirection: 'column',
    justifyContent: 'center',
  },
  operation: {
    marginTop: 20,
  },
});

export default HomeScreen;