import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {style} from '../../style/style';
import formImg from '../../assets/images/partcipentFormImg.png';
import {Button, Input} from 'react-native-elements';
import {useRoute} from '@react-navigation/native';
import TermAndCond from '../../components/termAndCond';
import {TextInput} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const termAndCon: any = {
  head: {mainHead: 'Participation Form Guidelines:', subHead: ''},
  body: [
    {
      head: ' Authorized Users:',
      content:
        'Only registered school principals, art teachers, or any designated school authority figures are permitted to fill out the participation form to enroll their students for participation.',
    },
    {
      head: 'Final Date Of Submission',
      content:
        'The final date to submit an online participation form with participation fees till 30th August 2025.',
    },
  ],
};

export const classData = [
  {cls: 'Nursery', fees: 100, students: 55},
  {cls: 'KG I', fees: 100, students: 4},
  {cls: 'KG II', fees: 100, students: 3},
  {cls: '1st', fees: 100, students: 55},
  {cls: '2nd', fees: 100, students: 4},
  {cls: '3rd', fees: 100, students: 3},
  {cls: '4th', fees: 100, students: 3},
  {cls: '5th', fees: 100, students: 3},
  {cls: '6th', fees: 100, students: 3},
  {cls: '7th', fees: 100, students: 3},
  {cls: '8th', fees: 100, students: 3},
  {cls: '9th', fees: 100, students: 3},
  {cls: '10th', fees: 100, students: 3},
];

const SchoolParticipationForm = ({route, navigation}: any) => {
  const {data, title, name} = route.params;
  const [studentEntry, setStudentEntry] = useState({});
  const [expanded, setExpanded] = useState(true);
  const symbol = '₹';

  const handleStudentCount = (name: any, value: any) =>
    setStudentEntry(pre => ({...pre, [name?.cls]: value}));

  const handleDetails = () => {
    // navigation.navigate('ConfirmationSection', { data: { studentEntry, classData, values: data?.values, symbol } });
    navigation.navigate('ConfirmationSection', {
      data: {
        studentEntry,
        classData,
        values: data?.values,
        symbol,
        level: data?.level,
      },
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={style.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Icon
            name="arrow-back"
            color="#130F26"
            size={22}
            style={{marginRight: 14}}
          />
          <Text style={[style.fs18, style.boldText, style.textColorBlack]}>
            {title ? title : name}
          </Text>
        </TouchableOpacity>
        <View style={style.brochureInfo}>
          {/* <Image source={formImg} style={style.participentformImg} /> */}
          <TermAndCond {...{data: termAndCon, expanded, setExpanded}} />
        </View>
        {data?.isPaymentDone ? (
          <View
            style={{
              height: responsiveHeight(60),
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
                Need to fill out the participation form again?{' '}
              </Text>
              <Text
                style={{fontSize: 16, color: '#93278f', fontWeight: 'bold'}}>
                Go to the homepage of National Talent Search {'>'} Refill School
                registration{' '}
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView>
            <View>
              <Text style={style.participentFeesHead}>
                Participation Fee : 100
              </Text>
              {/* <Text style={style.participentFees}>₹ 100</Text> */}
            </View>
            <View>
              <Text style={style.participentSelect}>
                Select your class & number of participants{' '}
              </Text>
              <View style={style.horizontalLine} />
            </View>
            <View>
              <View style={style.actionOtp}>
                <Text>Number Of Student </Text>
                <Icon name="keyboard-arrow-down" color="#93278f" size={25} />
              </View>
              <View>
                {classData?.map((e, i) => (
                  <View key={i} style={style.participentList}>
                    <View>
                      <Text style={style.participentClass}>
                        Class : <Text>{e?.cls}</Text>
                      </Text>
                      <Text style={style.fees}>
                        Fees : <Text>Rs.{e?.fees}</Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: '#7c7c7c14',
                        width: 70,
                        borderRadius: 10,
                      }}>
                      <TextInput
                        onChangeText={val => {
                          handleStudentCount(e, val);
                        }}
                        style={{
                          padding: 10,
                          fontSize: responsiveFontSize(1.972),
                          fontWeight: 'bold',
                          textAlign: 'right',
                        }}
                        placeholderTextColor="#0D253C"
                        keyboardType="numeric"
                        maxLength={10}
                        underlineColorAndroid="transparent"
                      />
                    </View>
                  </View>
                ))}
              </View>
              {!!Object.values(studentEntry)?.length && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Button
                    buttonStyle={{backgroundColor: '#93278f'}}
                    titleStyle={{color: '#fff'}}
                    title="Next"
                    containerStyle={{
                      width: 120,
                      borderRadius: 10,
                    }}
                    onPress={handleDetails}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SchoolParticipationForm;
