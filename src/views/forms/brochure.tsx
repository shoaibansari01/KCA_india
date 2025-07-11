import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {style} from '../../style/style';
import {Button} from 'react-native-elements';
import {s3PreFixUrl} from '../../helper/routes';
import {fileDownloader} from '../../helper/http';

const brouchureDataAsPerLevel: any = {
  national: {
    head: 'Brochure Access Instructions:',
    metaData:
      'This brochure is exclusively intended for school principals, art teachers, or any designated school authority figures.',
    accessInfo:
      'To access the brochure, please click on the link provided below:',
    link: 'Download the Brochure',
  },
  global: {
    head: 'Brochure Access',
    metaData:
      'The brochure, containing all details of the Global Art Exhibition, is available for students and professional artists.',
    accessInfo: '',
    link: 'Download the Brochure',
  },
};

const Brochure = ({route, navigation}: any) => {
  const {data, title} = route.params;
  const handleDetails = () => {
    navigation.navigate(
      `${
        data?.level == 'global'
          ? 'ParticipationForm'
          : 'SchoolParticipationForm'
      }`,
      {
        data: data,
        title:
          data?.level != 'global'
            ? 'School Participation Form'
            : 'Global Participation Form',
      },
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
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
              {title ?? ''}
            </Text>
          </TouchableOpacity>
          <View style={style.brochureInfo}>
            <Image
              style={[
                style.participentformImg,
                {height: 200, objectFit: 'fill'},
              ]}
              source={{
                uri: `${s3PreFixUrl}homepage/${
                  data?.level != 'global'
                    ? 'PAGE 1 FOR NET-1.png'
                    : 'global.png'
                } `,
              }}
            />
            <View style={style.brochureInfo.head}>
              <Text style={style.brochureInfo.head.mainHead}>
                {brouchureDataAsPerLevel[data?.level]?.head}
              </Text>
            </View>
            <Text style={style.brochureInfo.data}>
              {brouchureDataAsPerLevel[data?.level]?.metaData}
            </Text>
            <Text style={style.brochureInfo.acessText}>
              {brouchureDataAsPerLevel[data?.level]?.accessInfo}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.brochureInfo.brochureLink}>
                {brouchureDataAsPerLevel[data?.level]?.link}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  return fileDownloader(
                    data?.level != 'global'
                      ? 'nationalData/PRINCIPAL BROCHURE FOR NET.pdf'
                      : 'globalData/brochures/globalBrochure.pdf',
                  );
                }}>
                <Icon
                  name="download"
                  color="#93278f"
                  size={22}
                  style={{marginRight: 14}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {!data?.isPaymentDone && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 20,
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
    </SafeAreaView>
  );
};

export default Brochure;
