import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ListItem} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {style} from '../../style/style';
import Header from '../../components/header';
import {postReq} from '../../helper/http';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const UserDashboard = ({route, navigation}: any) => {
  const {data} = route.params;
  const [paymentStatus, setPaymentStatus]: any = useState({});
  const isNational = data?.level != 'global' ? true : false;
  const isAllRounder = data?.level === 'allrounder';
  const [loader, setLoader] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const arrMapped = [
    {
      name: 'My Registration Form',
      icon: 'event-note',
      redirect: 'MyRegistrationForm',
    },
    {
      name: isNational
        ? "Principal's Brochure"
        : 'Brochure of Global Art Exhibition',
      icon: 'mail',
      redirect: 'Brochure',
      title: isNational
        ? 'Brochure for School'
        : 'Brochure of Global Art Exhibition',
    },
    {
      name: `${isNational ? 'School ' : ''}Participation Form`,
      icon: 'article',
      redirect: `${
        isNational ? 'SchoolParticipationForm' : 'ParticipationForm'
      }`,
      title: isNational
        ? 'School Participation Form'
        : 'Global Participation Form',
    },
    // { name: isNational && "Student Participation Form", icon: "library-books", redirect: "StudentParticipationForm" },
    {
      name: `Upload ${isNational ? 'Student Data' : 'Art Work'}`,
      icon: 'upload-file',
      redirect: `${isNational ? 'UploadData' : 'UploadArtWork'}`,
    },
    // {
    //   name: isNational && 'View My Students',
    //   icon: 'people',
    //   redirect: 'ViewStudentData',
    // },
    {
      name: isNational && 'View Student Certificates',
      icon: 'card-membership',
      redirect: 'ViewStudentCertificates',
    },
    {
      name: isNational && 'Upload Photos',
      icon: 'add-photo-alternate',
      redirect: 'UploadPhotos',
    },
    {
      name: isNational && 'Winners Result',
      icon: 'library-books',
      redirect: 'WinnerResult',
    },
    // {name: 'My Account', icon: 'person', redirect: 'MyAccount'},
    // {name: 'Orders', icon: 'assignment-turned-in', redirect: ''},
  ];

  // All-Rounder specific dashboard items
  const allRounderTabs = [
    {
      name: 'ANNOUNCEMENT OF RESULTS',
      icon: 'campaign',
      action: () => setShowAnnouncementModal(true),
    },
    {
      name: 'UPLOAD 2 MIN VIDEO',
      icon: 'video-call',
      action: () => handleVideoUpload(),
    },
    {
      name: 'Download Best Performance Award E-Certificates (Every month of 30th)',
      icon: 'file-download',
      action: () => Alert.alert('Certificate', 'Certificate download will be available soon.'),
    },
  ];

  const handleVideoUpload = () => {
    Alert.alert(
      'Upload Video',
      'You can upload your 2-minute talent video through the Google Form link below.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Google Form',
          onPress: () => Linking.openURL('https://forms.gle/vhmDMcrSDu6K1eNcA'),
        },
      ]
    );
  };

  const checkPaymentStatus = async () => {
    setLoader(true);
    const res = await postReq({
      url: 'check-user-payment-status',
      data: {
        userId: data?.values?.userId,
        form_id: data?.values?._id,
        key: isNational ? 'isNational' : 'isGlobal',
      },
      returnKey: 'data',
    });
    res && setPaymentStatus(res);
    setLoader(false);
  };

  const handleDetails = (data: any) => {
    navigation.navigate(`${data?.redirect ?? ''}`, {...data});
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [data]);

  return (
    <SafeAreaView>
      <Header {...{ads: true}} />
      <View style={{padding: 20}}>
        <View style={style.moreDtls}>
          <Text style={style.moreDtls.text}>My Dashboard</Text>
        </View>
        {loader ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: responsiveHeight(80),
            }}>
            <ActivityIndicator size="large" color="#93278f" />
          </View>
        ) : (
          <View style={{marginTop: 20}}>
            <ScrollView>
              {(isAllRounder ? allRounderTabs : arrMapped)?.map(({name, icon, redirect, title, action}, i) => (
                <>
                  {name && (
                    <TouchableOpacity
                      onPress={() =>
                        isAllRounder 
                          ? action()
                          : handleDetails({
                              name,
                              icon,
                              redirect,
                              title,
                              data: {
                                ...data,
                                isPaymentDone:
                                  !!paymentStatus?.razorpay_payment_id?.length,
                              },
                            })
                      }
                      style={{
                        backgroundColor: `${
                          !!paymentStatus?.razorpay_payment_id?.length &&
                          [2].includes(i) && !isAllRounder
                            ? '#dfdbdbab'
                            : '#ffffff00'
                        }`,
                      }}>
                      <ListItem
                        key={i}
                        bottomDivider
                        containerStyle={{backgroundColor: 'transparent'}}>
                        <View style={style.circleIcon}>
                          <Icon color="#fff" size={18} name={icon} />
                        </View>
                        <ListItem.Content>
                          <ListItem.Title style={style.userOptDtls.text}>
                            {name}
                          </ListItem.Title>
                        </ListItem.Content>
                        {paymentStatus?.razorpay_payment_id &&
                        [2].includes(i) ? (
                          <View style={style.checkedIcon}>
                            <Icon size={16} color="#fff" name="check" />
                          </View>
                        ) : (
                          <ListItem.Chevron color="#000" />
                        )}
                      </ListItem>
                    </TouchableOpacity>
                  )}
                </>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Announcement Modal */}
      <Modal
        visible={showAnnouncementModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAnnouncementModal(false)}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 15,
            width: '90%',
            maxWidth: 350,
          }}>
            <View style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Icon
                name="campaign"
                color="#93278f"
                size={50}
                style={{ marginBottom: 15 }}
              />
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#93278f',
                textAlign: 'center',
                marginBottom: 10,
              }}>
                ANNOUNCEMENT OF RESULTS
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#333',
                textAlign: 'center',
                lineHeight: 24,
              }}>
                Results will be announced 30th of every month.
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => setShowAnnouncementModal(false)}
              style={{
                backgroundColor: '#93278f',
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 8,
                alignItems: 'center',
              }}>
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
                Got it!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserDashboard;
