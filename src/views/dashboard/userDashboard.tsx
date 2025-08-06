import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
  const [loader, setLoader] = useState(false);

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
    {
      name: isNational && 'View My Students',
      icon: 'people',
      redirect: 'ViewStudentData',
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
              {arrMapped?.map(({name, icon, redirect, title}, i) => (
                <>
                  {name && (
                    <TouchableOpacity
                      onPress={() =>
                        handleDetails({
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
                          [2].includes(i)
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
    </SafeAreaView>
  );
};

export default UserDashboard;
