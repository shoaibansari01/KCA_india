import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext, useState, useEffect} from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {style} from '../../style/style';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {ListItem} from 'react-native-elements';
import {AuthContext} from '../../helper/contex';
import {storageAuthKey} from '../../helper/config';

const DrawerScreen = ({props, navigation}: any) => {
  const {authData, setAuthData}: any = useContext(AuthContext);

  const handleLogout = async () => {
    navigation.closeDrawer();
    Alert.alert(
      null,
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setAuthData();
              await AsyncStorage.setItem(storageAuthKey, JSON.stringify({}));
              setAuthData({});
              navigation.navigate('SignIn');
            } catch (error) {
              console.error('Error while logging out:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView>
      <View style={style.drawerContainerModal}>
        <View style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="arrow-back"
                  color="#130F26"
                  size={22}
                  style={{marginRight: 14}}
                />
                <Text
                  style={[style.fs18, style.boldText, style.textColorBlack]}>
                  Profile
                </Text>
              </View>
            </TouchableOpacity>
            {/* <Icon name="notifications-none" color="#130F26" size={30} /> */}
          </View>

          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              marginHorizontal: 20,
              alignItems: 'center',
            }}>
            <View style={style.profileCircleIcon}>
              <Icon name="person-outline" color="#fff" size={20} />
            </View>
            <View style={{flexDirection: 'column'}}>
              <View>
                <Text
                  style={[style.fs22, style.boldText, style.textColorBlack]}>
                  {authData?.user?.name?.substring(0, 10) ?? ''}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}>
                  <Text style={style.registerLink}>View Profile</Text>
                </TouchableOpacity>
                <Icon name="keyboard-arrow-right" color="#93278f" size={25} />
              </View>
            </View>
          </View>

          <HorizontalLine />

          <ScrollView>
            <View>
              {[
                {
                  icon: 'favorite-outline',
                  name: 'My Favorites',
                  redirect: 'Favourite',
                },
                {
                  icon: 'dashboard',
                  name: 'My Dashboard',
                  redirect: 'MyDasboards',
                },
                {
                  icon: 'contact-page',
                  name: 'Certificate',
                  redirect: 'Certificates',
                },
                {
                  icon: 'payment',
                  name: 'Payment Details',
                  redirect: 'PaymentDetails',
                },
                // { icon: "feedback", name: "Feedback", redirect: "" },
                // { icon: "ads-click", name: "Ads", redirect: "" },
                {icon: 'info', name: 'About KCA', redirect: 'AboutUs'},
                {
                  icon: 'assignment',
                  name: 'Term & Condition',
                  redirect: 'TermAndCond',
                },
                {icon: 'policy', name: 'Policys', redirect: 'Policys'},
                // { icon: "support", name: "Support", redirect: "" },
                // { icon: "settings", name: "Setting", redirect: "" },
                {
                  icon: 'logout',
                  name: 'Logout',
                  redirect: '',
                  callBack: handleLogout,
                },
              ].map(({icon, name, redirect, callBack}: any, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    name != 'Logout' && navigation.navigate(redirect),
                      callBack && callBack();
                  }}>
                  <ListItem
                    key={i}
                    bottomDivider
                    containerStyle={{
                      backgroundColor: 'transparent',
                      paddingVertical: 10,
                      paddingHorizontal: 0,
                    }}>
                    <View style={style.circleIcon}>
                      <Icon size={18} color="#fff" name={icon} />
                    </View>
                    <ListItem.Content>
                      <ListItem.Title style={style.userOptDtls.text}>
                        {name}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron color="#000" />
                  </ListItem>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const HorizontalLine = () => (
  <View
    style={{
      height: 1,
      backgroundColor: 'black',
      marginBottom: 20,
      marginTop: 15,
    }}
  />
);
export default DrawerScreen;
