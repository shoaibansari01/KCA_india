import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { style } from '../style/style';
import { AuthContext } from '../helper/contex';
import { FormApi } from '../helper/http';
import {s3PreFixUrl} from '../helper/routes';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import DocumentPicker from 'react-native-document-picker';
import { Animated } from 'react-native';

const AllRounderPaymentScreen = ({ route, navigation }: any) => {
  const { authData }: any = useContext(AuthContext);
  const { formData, totalFee, selectedTalents } = route.params;
  
  const [fileResponse, setFileResponse]: any = useState(null);
  const [fileErr, setFileErr]: any = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isPaymentComplete, setIsPaymentComplete] = useState({
    success: false,
    err: false,
  });

  const talentLabels = {
    bestChildArtist: 'Best Child Artist Award',
    bestChildAnchor: 'Best Child Anchor Award',
    bestChildDancer: 'Best Child Dancer Award',
    bestChildFamilyConversation: 'Best Child Family Conversation Award',
    bestChildMusician: 'Best Child Musician Award',
    bestChildRampWalker: 'Best Child Ramp Walker Award',
    bestChildSinger: 'Best Child Singer Award',
    bestChildStoryteller: 'Best Child Storyteller Award',
    bestShlokaReciter: 'Best Shloka Reciter Award',
    bestChildSelfIntroduction: 'Best Child Self Introduction Award',
  };

  const handleDocumentPicker = async () => {
    try {
      const res: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      if (allowedExtensions.includes(res[0]?.name?.split('.').pop())) {
        setFileResponse(res);
        setFileErr('');
      } else {
        setFileResponse(null);
        Alert.alert('Invalid File', 'Please select an .png,.jpeg,.png file.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.warn('Canceled from document picker');
      } else {
        console.warn('Unknown error: ', err);
        throw err;
      }
    }
  };

  const handlePaymentModal = (success: any, err: any) => {
    setIsPaymentComplete(pre => ({ ...pre, success, err }));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = (success: any, err: any, redirect: any = false) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(async () => {
      await setIsPaymentComplete(pre => ({ ...pre, success, err }));
      redirect &&
        navigation.navigate('UserDashboard', {
          data: {
            level: 'allrounder',
            values: formData,
            userInfo: formData,
          },
        });
    });
  };

  const uploadPaymentReceipt = async () => {
    if (!fileResponse?.[0]?.name) {
      return setFileErr('Payment receipt is required');
    }

    setFileErr('');
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('files', {
      uri: fileResponse[0].uri,
      type: fileResponse[0].type,
      name: fileResponse[0].name,
    } as any);

    const dataToSend = {
      ...formData,
      formType: 'A',
      userId: authData?.user?.userId,
      talent_categories: selectedTalents,
      totalFee: `₹ ${totalFee}`,
      talentCount: selectedTalents.length,
    };
    
    console.log('AllRounder form data being sent:', JSON.stringify(dataToSend, null, 2));
    
    formDataToSend.append('data', JSON.stringify(dataToSend));

    try {
      const directResponse = await FormApi.post('submit-allrounder-form', formDataToSend);
      const uploadResult = directResponse?.data;

      if (uploadResult && uploadResult.data && uploadResult.message) {
        Alert.alert('Success', uploadResult.message);
        handlePaymentModal(true, false);
      } else if (uploadResult && uploadResult.statusCode === 500) {
        Alert.alert('Server Error', uploadResult.message || 'Internal server error occurred.');
      } else {
        Alert.alert(
          'Upload Failed', 
          'Failed to submit form. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || 'Failed to submit form. Please try again.';
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            style={{ marginRight: 14 }}
          />
          <Text style={[style.fs18, style.boldText, style.textColorBlack]}>
            Total Fees
          </Text>
        </TouchableOpacity>

        <View style={style.confirmEntrySec}>
          <ScrollView>
            <View style={style.finalFeeConfCard}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                  <Text style={style.confirmEntryCardDetails}>
                    Selected Talents
                  </Text>
                  <Text style={style.confirmEntryCardDetails}>Amount</Text>
                </View>
                <View style={style.horizontalLine} />
              </View>

              <View style={{ marginVertical: 20 }}>
                {selectedTalents.map((talent: string, index: number) => (
                  <View key={index}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}>
                      <Text style={style.confirmEntryCardDetails}>
                        {talentLabels[talent] || talent}
                      </Text>
                      <Text style={style.confirmEntryCardDetails}>₹ 60</Text>
                    </View>
                    <View style={style.dividerfinalFees} />
                  </View>
                ))}
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                  <Text style={style.confirmEntryCardDetails}>
                    Total ({selectedTalents.length} {selectedTalents.length === 1 ? 'talent' : 'talents'})
                  </Text>
                  <Text style={style.totalFinalFees}>₹ {totalFee}</Text>
                </View>
              </View>

              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Image
                  source={{uri: `${s3PreFixUrl}kcaCred/KcaQR.jpeg`}}
                  style={{ width: 250, height: 300 }}
                />
                <Text style={style.confirmEntryCardDetails}>
                  Pay participation fees via KCA QR code or GPay using KCA
                  number: 7770016545. Send screenshot of payment confirmation to
                  the same number.
                </Text>

                <View style={{ marginHorizontal: 0, marginTop: 20 }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginTop: 10,
                      fontSize: responsiveFontSize(1.8),
                      color: '#93278f',
                      textAlign: 'center',
                      marginBottom: 10,
                    }}>
                    Upload your payment receipt.
                  </Text>
                  <TouchableOpacity
                    style={[style.uploaddatadashBorder, { padding: 10 }]}
                    onPress={handleDocumentPicker}>
                    <Text style={style.uploaddataDragDrop}>Browse Files</Text>
                  </TouchableOpacity>
                  {!!fileErr?.length && (
                    <Text
                      style={[
                        style.errorText,
                        { fontSize: responsiveFontSize(1.6) },
                      ]}>
                      {fileErr}
                    </Text>
                  )}
                  {fileResponse?.[0]?.name && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      <Icon
                        name="file-present"
                        color="#18701f"
                        size={25}
                        style={{ marginRight: 14 }}
                      />
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.74),
                          fontWeight: 'bold',
                        }}>
                        {fileResponse?.[0]?.name.slice(0, 30)}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                  <Button
                    buttonStyle={{ backgroundColor: '#93278f' }}
                    titleStyle={{ color: '#fff' }}
                    title={isLoading ? 'Submitting...' : 'Submit Form & Receipt'}
                    onPress={uploadPaymentReceipt}
                    loading={isLoading}
                    disabled={isLoading}
                    containerStyle={{
                      width: 200,
                      borderRadius: 10,
                      marginVertical: 30,
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <Modal
          visible={isPaymentComplete?.success}
          transparent={true}
          animationType="slide"
          onRequestClose={() => closeModal(false, false, true)}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <Icon
                name="check-circle"
                color="#1c9c52"
                size={60}
                style={{ marginRight: 14, marginBottom: 15 }}
              />
              <Text style={styles.modalText}>
                Registration has been submitted successfully! 
                We will review your Fees Receipt and update your registration status.
              </Text>
              <TouchableOpacity
                onPress={() => closeModal(false, false, true)}
                style={[styles.closeButton, { backgroundColor: '#1c9c52' }]}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        <Modal
          visible={isPaymentComplete?.err}
          transparent={true}
          animationType="slide"
          onRequestClose={() => closeModal(false, false)}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <Icon
                name="error"
                color="#b82c39"
                size={60}
                style={{ marginRight: 14, marginBottom: 15 }}
              />
              <Text style={styles.modalText}>
                Unfortunately, we have an issue with your submission. Try again
                later.
              </Text>
              <TouchableOpacity
                onPress={() => closeModal(false, false)}
                style={[styles.closeButton, { backgroundColor: '#b82c39' }]}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: responsiveFontSize(1.74),
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AllRounderPaymentScreen;