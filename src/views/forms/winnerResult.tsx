import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import formImg from '../../assets/images/partcipentFormImg.png';
import {style} from '../../style/style';
import {s3PreFixUrl} from '../../helper/routes';
// import {openPDF} from '../../components/resultPage';
import {BlinkingText} from '../../components/BlinkingText';

const WinnerResult = ({navigation, route}: any) => {
  const {data, title, name} = route.params;

  const showResultAlert = () => {
    Alert.alert(
      'Winner Result',
      'Result will be declared in the month of October 2025',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ],
      { cancelable: true }
    );
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
            {name ?? ''}
          </Text>
        </TouchableOpacity>
        <View style={style.brochureInfo}>
          <Image
            style={[style.participentformImg, {height: 200, objectFit: 'fill'}]}
            source={{uri: `${s3PreFixUrl}homepage/national.png`}}
          />
          {/* <Text style={style.stdParticipentHead}>Winner's Result</Text> */}
          {/* <Text style={style.stdParticipentHead}>MAGIC COLOURS</Text> */}

          {/* <TermAndCond {...{ data: termAndCon }} /> */}
        </View>
        {/* <ScrollView> */}
        <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {/* <Text style={style.stdParticipentHead}>Winner's Result</Text> */}
          <TouchableOpacity onPress={showResultAlert}>
            <Text style={[style.stdParticipentText, { marginTop: 0, color: "#93278f", fontWeight: "bold" }]}>Download Here</Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

export default WinnerResult;
