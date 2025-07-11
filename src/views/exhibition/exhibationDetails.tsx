import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {style} from '../../style/style';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {postReq} from '../../helper/http';
import {SliderBox} from 'react-native-image-slider-box';
import {s3PreFixUrl} from '../../helper/routes';
import {countryArr, littleLegs, onShare} from '../../helper/reusableFun';
import ImageModal from 'react-native-image-modal';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Input} from 'react-native-elements';
import {AuthContext} from '../../helper/contex';
import {ScrollView} from 'react-native-gesture-handler';

const _data: any = {
  collegeStud: 'College Student',
  schoolStud: 'School student',
  professionalArtists: 'Professional Artist',
};

const ExhibitionDetails = ({route, navigation}: any) => {
  const {data} = route.params;
  const {authData}: any = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clickedImagePath, setClickedImagePath] = useState('');
  const [isLike, setIsLike] = useState(false);
  const [likeImgArr, setLikeImgArr]: any = useState([]);
  const [exhibitionData, setExhibitionData]: any = useState([]);
  const [loder, setLoader] = useState(false);
  const [likeLoder, setLikeLoader] = useState(false);
  const [cmntLoder, setCmntLoader] = useState(false);
  const [comment, setComment] = useState('');
  const [currImgDtls, setCurrImgDtls]: any = useState({});
  const [myCmnts, setMyCmnt] = useState([]);
  const [imgId, setImgId] = useState('');
  const [likeCount, setImgLikeCount]: any = useState();
  const [imgData, setImgData]: any = useState({});
  const [getCmntLoader, setGetCmntLoader] = useState(false);

  const getExibitionByFormId = async (form_id: any) => {
    setLoader(true);
    const res = await postReq({
      url: `get-exibition-by-form-id`,
      data: {form_id},
      returnKey: 'data',
    });
    if (res) {
      setExhibitionData(res);
      setImgId(res[0]._id);
      await currentImgIdx(0, res);
      await getLikes();
    }
    setLoader(false);
  };

  const getLikes = async () => {
    const res = await postReq({
      url: `get-likes`,
      data: {userId: data?.userId, formId: data?.formId?._id},
      returnKey: 'data',
    });
    res &&
      setLikeImgArr(
        res?.reduce((a: any, c: any) => {
          a.push(c?.pictureId);
          return a;
        }, []),
      );
  };

  const handleImagePress = (i: number) => {
    const imgObj = exhibitionData[i];
    const clickedImagePath = `${s3PreFixUrl}${imgObj?.url}`;

    setClickedImagePath(clickedImagePath);
    setIsModalVisible(true);
  };
  const currentImgIdx = async (i: any, data: any = {}) => {
    setImgData({});
    setImgLikeCount(0);
    setMyCmnt([]);
    const curImg = data[i] ?? exhibitionData[i];
    setImgId(curImg._id);
    setCurrImgDtls(curImg);
    getCurIMgLikeCount(curImg?._id);
    await getComment(curImg?._id, true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setClickedImagePath('');
  };

  const favorite = async (op: any, imgPath: any) => {
    setLikeLoader(true);
    if (op == 'like') {
      setImgLikeCount(likeCount + 1);
      setLikeImgArr((pre: any) => [...pre, imgPath]);
    }
    if (op != 'like') {
      setImgLikeCount(likeCount - 1);
      setLikeImgArr((pre: any) => pre?.filter((e: any) => e != imgPath));
    }
    const res = await postReq({
      url: `like-img/${op}`,
      data: {
        formId: data?.formId?._id,
        userId: data?.userId,
        pictureId: imgPath,
      },
      returnKey: 'data',
    });
    getLikes();
    setLikeLoader(false);
  };

  const handleSchoolName = (val: any, name: any) => setComment(val);

  const handleComment = async (comment: any, data: any) => {
    setCmntLoader(true);
    const res = await postReq({
      url: `comment`,
      data: {
        comment,
        picture_id: data?._id,
        formId: data?.formId?._id,
        userId: authData?.user?.userId,
      },
      returnKey: 'data',
    });
    await getComment(data?._id);
    setCmntLoader(false);
    setComment('');
  };

  const getComment = async (id: any, formSlider = false) => {
    formSlider && setGetCmntLoader(true);
    const res = await postReq({
      url: `get-comment`,
      data: {picture_id: id, userId: authData?.user?.userId},
      returnKey: 'data',
    });
    res && setMyCmnt(res?.reverse());
    setGetCmntLoader(false);
  };
  const getCurIMgLikeCount = async (imgId: any) => {
    const res = await postReq({
      url: `get-perticular-img-likes`,
      data: {imgId},
      returnKey: 'data',
    });
    if (res) {
      setImgData(res);
      setImgLikeCount(res?.likeCounts ?? 0);
    }
  };

  useEffect(() => {
    if (data?.formId?._id) getExibitionByFormId(data?.formId?._id);
    if (data?._id) getCurIMgLikeCount(data?._id);
  }, [data?.formId?._id]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 20, paddingBottom: 0}}>
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
            Exhibition Details
          </Text>
        </TouchableOpacity>
      </View>
      {loder ? (
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
        <>
          <ScrollView>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: responsiveHeight(83),
              }}>
              <View>
                <View>
                  <SliderBox
                    autoplay={false}
                    circleLoop={false}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    ImageComponentStyle={{width: '90%', height: 200}}
                    images={exhibitionData?.map(
                      (e: any) => `${s3PreFixUrl}${e?.url}`,
                    )}
                    onCurrentImagePressed={handleImagePress}
                    currentImageEmitter={currentImgIdx}
                  />
                </View>
                <View style={styles.operation}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#93278f',
                        fontWeight: 'bold',
                      }}>
                      {imgData?.price
                        ? `${
                            imgData?.isGlobal &&
                            imgData?.formId?.country != 'IN'
                              ? '$'
                              : '₹'
                          } ${imgData?.price}`
                        : ''}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <View>
                      {!likeImgArr?.includes(imgId) ? (
                        <TouchableOpacity
                          onPress={() => {
                            setIsLike(!isLike), favorite('like', imgId);
                          }}
                          disabled={likeLoder}>
                          <Icon
                            name={`favorite-border`}
                            size={30}
                            color="#93278f"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setIsLike(!isLike), favorite('unlike', imgId);
                          }}
                          disabled={likeLoder}>
                          <Icon name={`favorite`} size={30} color="#93278f" />
                        </TouchableOpacity>
                      )}
                    </View>
                    {!!likeCount && (
                      <View style={{marginHorizontal: 10}}>
                        <Text style={{fontSize: 18, color: '#93278f'}}>
                          {likeCount}
                        </Text>
                      </View>
                    )}
                    <View>
                      <TouchableOpacity>
                        <Icon
                          name="share"
                          color="#93278f"
                          size={30}
                          onPress={() =>
                            onShare(
                              `Check Out This Picture https://kcaindia.com/app-link-redirect?app=kcagroup://exibition/${data?.formId?._id}/${imgId}`,
                              `https://kcaindia.com/app-link-redirect?app=kcagroup://exibition/${data?.formId?._id}/${imgId}`,
                            )
                          }
                          style={{marginLeft: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {!!exhibitionData?.length &&
                  exhibitionData[0]?.formId?.category && (
                    <View style={{paddingHorizontal: 20, paddingTop: 10}}>
                      <View style={style.row}>
                        <Text style={style.detailsHead}>
                          {_data[exhibitionData[0]?.formId?.category]} :
                        </Text>
                        <Text
                          style={[
                            style.detailsValue,
                            {flex: 1, flexWrap: 'wrap'},
                          ]}>{`${
                          exhibitionData[0]?.formId?.name_of_participant
                            ? `${exhibitionData[0]?.formId?.name_of_participant}, `
                            : ''
                        } ${
                          exhibitionData[0]?.formId?.category == 'schoolStud'
                            ? exhibitionData[0]?.formId?.class_name
                              ? `${exhibitionData[0]?.formId?.class_name}, `
                              : ''
                            : exhibitionData[0]?.formId?.category ==
                              'collegeStud'
                            ? exhibitionData[0]?.formId?.std_qualification
                              ? `${exhibitionData[0]?.formId?.std_qualification}, `
                              : ''
                            : ''
                        } ${
                          exhibitionData[0]?.formId?.city
                            ? `${exhibitionData[0]?.formId?.city}, `
                            : ''
                        } ${
                          exhibitionData[0]?.formId?.dist
                            ? `${exhibitionData[0]?.formId?.dist}, `
                            : ''
                        } ${
                          exhibitionData[0]?.formId?.state
                            ? `${exhibitionData[0]?.formId?.state}, `
                            : ''
                        } ${
                          countryArr?.reduce((a, c) => {
                            if (c?.value == exhibitionData[0]?.formId?.country)
                              a = c?.label;
                            return a;
                          }, '') ?? ''
                        } `}</Text>
                      </View>
                    </View>
                  )}
              </View>

              <View style={{padding: 20, paddingTop: 0, paddingBottom: 0}}>
                {exhibitionData[0]?.formId?.userId?.id !=
                  authData?.user?.userId && getCmntLoader ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: responsiveHeight(40),
                    }}>
                    <ActivityIndicator size="large" color="#93278f" />
                  </View>
                ) : (
                  <>
                    {!!myCmnts?.length && (
                      <View style={style.comntSec}>
                        <ScrollView>
                          {myCmnts?.map((e: any, i) => (
                            <View
                              style={{marginBottom: 10, paddingHorizontal: 20}}>
                              {!e?.isOwner ? (
                                <View style={style.outgoingCmnt}>
                                  <Text>{e?.text}</Text>
                                </View>
                              ) : (
                                <View style={style.incommingCmnt}>
                                  <Text>{e?.text}</Text>
                                </View>
                              )}
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {cmntLoder ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: responsiveHeight(15),
                        }}>
                        <ActivityIndicator size="large" color="#93278f" />
                      </View>
                    ) : currImgDtls?.blockUsers?.includes(
                        authData?.user?.userId,
                      ) ? (
                      <View style={{paddingVertical: 20}}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: '500',
                            textAlign: 'center',
                          }}>
                          You are not allowed to comment here.
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Input
                          errorStyle={{color: 'red'}}
                          label="Interested to buy"
                          value={comment}
                          disabled={cmntLoder}
                          style={[
                            style.formGroup,
                            {backgroundColor: '#972aa11a'},
                          ]}
                          labelStyle={{color: '#001B47', marginBottom: 8}}
                          placeholderTextColor="#0D253C"
                          onChangeText={val => handleSchoolName(val, 'comment')}
                          rightIcon={
                            comment?.length ? (
                              <Icon
                                disabled={cmntLoder}
                                name={'send'}
                                type="ionicon"
                                color="#93278f"
                                iconStyle={{fontSize: 22, marginLeft: 10}}
                                onPress={
                                  cmntLoder
                                    ? null
                                    : () => handleComment(comment, currImgDtls)
                                }
                              />
                            ) : null
                          }
                        />
                      </View>
                    )}
                  </>
                )}

                <Modal
                  visible={isModalVisible}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={closeModal}>
                  <View style={styles.modalBackground}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}>
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
            </View>
          </ScrollView>
        </>
      )}
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
    // backgroundColor: "red",
    flexDirection: 'column',
    justifyContent: 'center',
    // flex:1
  },
  operation: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // backgroundColor:"red"
  },
});

export default ExhibitionDetails;
