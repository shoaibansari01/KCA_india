import {View, Text, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {style} from '../../style/style';
import {DataTable, List} from 'react-native-paper';
import {postReq} from '../../helper/http';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import moment from 'moment';

const levelData: any = {
  national: 'isNational',
  global: 'isGlobal',
};

const MyAccount = ({navigation, route}: any) => {
  const {data, name} = route.params;
  const [loader, setLoader] = useState(false);
  const [paymentData, setPaymentData]: any = useState({});

  const getPayment = async () => {
    const res = await postReq({
      url: 'get-user-payments',
      data: {type: levelData[data?.level], form_id: data?.values?._id},
      returnKey: 'data',
    });
    res && setPaymentData(res);
    setLoader(false);
  };

  useEffect(() => {
    setLoader(true);
    getPayment();
  }, []);
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f6fa'}}>
      <View style={[style.container, {flex: 1}]}>
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
        
        <ScrollView 
          style={{flex: 1}} 
          contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
        >
          {loader ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: responsiveHeight(70),
              }}>
              <ActivityIndicator size="large" color="#93278f" />
            </View>
          ) : paymentData && Object.keys(paymentData)?.length ? (
            <>
              {/* Header Card */}
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 15,
                  padding: 20,
                  marginBottom: 20,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                <Text
                  style={{
                    color: '#93278f',
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 'bold',
                    marginBottom: 5,
                  }}>
                  Participation Form
                </Text>
                <View
                  style={{
                    height: 3,
                    backgroundColor: '#93278f',
                    width: 60,
                    alignSelf: 'center',
                    borderRadius: 2,
                  }}
                />
              </View>

              {data?.level == 'national' ? (
                <>
                  {/* School Data Table Card */}
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 15,
                      padding: 15,
                      marginBottom: 20,
                      elevation: 3,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: '#333',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 15,
                        textAlign: 'center',
                      }}>
                      School Registration Details
                    </Text>
                    <DataTable>
                      <DataTable.Header style={{backgroundColor: '#f8f9fa'}}>
                        <DataTable.Title textStyle={{fontWeight: 'bold', color: '#93278f'}}>Class</DataTable.Title>
                        <DataTable.Title numeric textStyle={{fontWeight: 'bold', color: '#93278f'}}>Students</DataTable.Title>
                        <DataTable.Title numeric textStyle={{fontWeight: 'bold', color: '#93278f'}}>Fees</DataTable.Title>
                        <DataTable.Title numeric textStyle={{fontWeight: 'bold', color: '#93278f'}}>Total</DataTable.Title>
                      </DataTable.Header>
                      {paymentData?.student_data?.length &&
                        paymentData?.student_data?.map((e: any, index: number) => (
                          <DataTable.Row key={index} style={{backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'}}>
                            <DataTable.Cell textStyle={{color: '#333', fontWeight: '500'}}>{e?.className ?? ''}</DataTable.Cell>
                            <DataTable.Cell numeric textStyle={{color: '#333'}}>
                              {e?.no_of_student ?? ''}
                            </DataTable.Cell>
                            <DataTable.Cell numeric textStyle={{color: '#333'}}>
                              ₹ {e?.fees ?? ''}
                            </DataTable.Cell>
                            <DataTable.Cell numeric textStyle={{color: '#333', fontWeight: 'bold'}}>
                              ₹ {e?.total ?? ''}
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                      <DataTable.Row style={{backgroundColor: '#e8f5e8', borderTopWidth: 2, borderTopColor: '#93278f'}}>
                        <DataTable.Cell></DataTable.Cell>
                        <DataTable.Cell numeric></DataTable.Cell>
                        <DataTable.Cell numeric textStyle={{fontWeight: 'bold', color: '#93278f'}}>Grand Total:</DataTable.Cell>
                        <DataTable.Cell numeric textStyle={{fontWeight: 'bold', color: '#93278f', fontSize: 16}}>
                          ₹ {paymentData?.amount ?? ''}
                        </DataTable.Cell>
                      </DataTable.Row>
                    </DataTable>
                  </View>

                  {/* Payment Details Card */}
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 15,
                      padding: 20,
                      elevation: 3,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: '#333',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 15,
                        textAlign: 'center',
                      }}>
                      Payment Information
                    </Text>
                    <List.Section style={{marginTop: 0}}>
                      <List.Item
                        title={`Order ID: ${paymentData?.order_id
                          ?.split('_')
                          .pop()}`}
                        titleStyle={{color: '#333', fontWeight: '500'}}
                        left={() => <List.Icon icon="receipt" color="#93278f" />}
                        style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: 10,
                          marginBottom: 8,
                        }}
                      />
                      <List.Item
                        title={`Payment Time: ${moment(
                          paymentData?.created_at,
                        ).format('DD MMM YYYY HH:mm')}`}
                        titleStyle={{color: '#333', fontWeight: '500'}}
                        left={() => <List.Icon icon="clock-time-three-outline" color="#93278f" />}
                        style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: 10,
                        }}
                      />
                    </List.Section>
                  </View>
                </>
              ) : (
                <>
                  {/* Global Art Exhibition Details */}
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 15,
                      padding: 20,
                      marginBottom: 20,
                      elevation: 3,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: '#333',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 20,
                        textAlign: 'center',
                      }}>
                      Art Exhibition Details
                    </Text>
                    
                    <View
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                        borderLeftWidth: 4,
                        borderLeftColor: '#93278f',
                      }}>
                      <Text style={{
                        fontSize: 14,
                        color: '#666',
                        marginBottom: 4,
                        fontWeight: '500'
                      }}>Number of Artworks Selected</Text>
                      <Text style={{
                        fontSize: 20,
                        color: '#93278f',
                        fontWeight: 'bold'
                      }}>
                        {paymentData?.art_Work_select} Artworks
                      </Text>
                    </View>
                    
                    <View
                      style={{
                        backgroundColor: '#e8f5e8',
                        borderRadius: 12,
                        padding: 16,
                        borderLeftWidth: 4,
                        borderLeftColor: '#28a745',
                      }}>
                      <Text style={{
                        fontSize: 14,
                        color: '#666',
                        marginBottom: 4,
                        fontWeight: '500'
                      }}>Total Registration Fee</Text>
                      <Text style={{
                        fontSize: 24,
                        color: '#28a745',
                        fontWeight: 'bold'
                      }}>
                        {paymentData?.form_id?.country == 'IN' ? '₹' : '$'} {paymentData?.amount}
                      </Text>
                    </View>
                  </View>

                  {/* Payment Details Card */}
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 15,
                      padding: 20,
                      elevation: 3,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: '#333',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 15,
                        textAlign: 'center',
                      }}>
                      Payment Information
                    </Text>
                    <List.Section style={{marginTop: 0}}>
                      <List.Item
                        title={`Order ID: ${paymentData?.order_id
                          ?.split('_')
                          .pop()}`}
                        titleStyle={{color: '#333', fontWeight: '500'}}
                        left={() => <List.Icon icon="receipt" color="#93278f" />}
                        style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: 10,
                          marginBottom: 8,
                        }}
                      />
                      <List.Item
                        title={`Payment Time: ${moment(
                          paymentData?.created_at,
                        ).format('DD MMM YYYY HH:mm')}`}
                        titleStyle={{color: '#333', fontWeight: '500'}}
                        left={() => <List.Icon icon="clock-time-three-outline" color="#93278f" />}
                        style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: 10,
                        }}
                      />
                    </List.Section>
                  </View>
                </>
              )}
            </>
          ) : (
            <View
              style={{
                height: responsiveHeight(60),
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 15,
                padding: 30,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}>
              <Icon
                name="payment"
                size={60}
                color="#ddd"
                style={{marginBottom: 20}}
              />
              <Text
                style={{
                  color: '#93278f',
                  fontSize: 18,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  lineHeight: 24,
                }}>
                No Payment Records Found
              </Text>
              <Text
                style={{
                  color: '#666',
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 20,
                }}>
                You haven't made any payments for participation forms yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyAccount;