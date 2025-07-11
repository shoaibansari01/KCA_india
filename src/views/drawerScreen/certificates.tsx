import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {style} from '../../style/style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';

const Certificates = ({navigation}: any) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={style.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Icon
            name="arrow-back"
            color="#130F26"
            size={24}
            style={{marginRight: 14}}
          />
          <Text style={[style.fs22, style.boldText, style.textColorBlack]}>
            Certificates
          </Text>
        </TouchableOpacity>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom: 25}}>
            <Text style={[style.fs20, style.boldText, style.textColorPrimary, {marginBottom: 15}]}>
              NATIONAL TALENT SEARCH DRAWING AND PAINTING COMPETITION
            </Text>
            <Text style={[style.fs16, style.textColorSecondary, {lineHeight: 22, marginBottom: 10}]}>
              Participants can download E-Consolation Certificates from October 2025.
            </Text>
          </View>

          <View style={{marginBottom: 25}}>
            <Text style={[style.fs20, style.boldText, style.textColorPrimary, {marginBottom: 15}]}>
              GLOBAL ART EXHIBITION
            </Text>
            <Text style={[style.fs16, style.textColorSecondary, {lineHeight: 22, marginBottom: 10}]}>
              Participants can download E-Certificates from November 2025.
            </Text>
          </View>

          <View style={{backgroundColor: '#f8f9fa', padding: 20, borderRadius: 12, marginTop: 20}}>
            <Text style={[style.fs16, style.mediumText, style.textColorPrimary, {textAlign: 'center', lineHeight: 24}]}>
              All certificates will be available in digital format and can be downloaded from the respective competition pages once they are released.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Certificates;
