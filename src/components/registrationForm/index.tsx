import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {style} from '../../style/style';
import {Button, Input} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import TermAndCond from '../termAndCond';
import DropDown from '../dropDown';
import {classData} from '../../views/forms/schoolParticipationForm';
import {AuthContext} from '../../helper/contex';
import useForm from '../../hook/useForm';
import {postReq} from '../../helper/http';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {countryArr, littleLegs} from '../../helper/reusableFun';

const Stack = createStackNavigator();

export const registrationFormFormat: any = {
  national: {
    0: [
      {
        name: 'school_name',
        label: 'Name Of The School',
        placeholder: 'Enter school name',
        type: 'text',
      },
      {
        name: 'principal_name',
        label: 'Name of the Principal',
        placeholder: 'Enter name of the Principal',
        type: 'text',
      },
      {
        name: 'email_of_school',
        label: 'Email-ID',
        placeholder: 'Enter School email',
        type: 'text',
      },
      {
        name: 'contact_number_of_school',
        label: 'Contact Number',
        placeholder: 'Enter School contact number',
        type: 'text',
      },
    ],
    1: [
      {
        name: 'school_add',
        label: 'School Correspondence Address',
        placeholder: 'Enter School Correspondence Address',
        type: 'text',
      },

      {
        name: 'city',
        label: 'City',
        placeholder: 'Enter city',
        type: 'text',
      },
      {
        name: 'dist',
        label: 'Enter your District',
        placeholder: 'Enter your District',
        type: 'text',
        viewableCb: (e: any) => null,
      },
      {
        name: 'state',
        label: 'State',
        placeholder: 'Enter state',
        type: 'text',
        viewableCb: (e: any) => null,
      },
      {
        name: 'school_pin',
        label: 'Pin Code',
        placeholder: 'Enter pin',
        type: 'text',
      },
    ],
    2: [
      {
        name: 'name_of_art_teacher',
        label: 'Name Of The Art Teacher',
        placeholder: 'Enter name of the art teacher',
        type: 'text',
      },
      {
        name: 'art_teacher_email',
        label: 'Email-ID',
        placeholder: 'Enter Art Teacher Email',
        type: 'text',
      },
      {
        name: 'art_teacher_number',
        label: 'Contact Number',
        placeholder: 'Enter Art Teacher contact number',
        type: 'text',
      },
      {
        name: 'honorarium_name',
        label: 'Honorarium award (above 150 participants) in favour of',
        placeholder: 'Enter The Name',
        type: 'text',
      },
    ],
  },
  global: {
    0: [
      {
        name: 'name_of_participant',
        label: 'Name Of The Participant',
        placeholder: 'Enter Participant name',
        type: 'text',
      },
      {
        name: 'dob_of_participant',
        label: 'Date Of Birth',
        placeholder: 'Enter DOB',
        type: 'date',
      },
      {
        name: 'category',
        label: 'Select Category',
        placeholder: 'Select Category',
        type: 'select',
        opt: [
          {value: 'schoolStud', label: 'School Students'},
          {value: 'collegeStud', label: 'College Students'},
          {value: 'professionalArtists', label: 'Professional Artists'},
        ],
      },
    ],
    1: {
      schoolStud: [
        {
          name: 'class_name',
          label: 'Enter Class',
          placeholder: 'Enter Class name',
          type: 'select',
          opt: classData.map((e: any) => ({label: e.cls, value: e.cls})),
        },
        {
          name: 'school_name',
          label: 'Name Of the School',
          placeholder: 'Enter Name Of School',
          type: 'text',
        },
        {
          name: 'school_email',
          label: 'Email',
          placeholder: 'Enter Email',
          type: 'text',
        },
        {
          name: 'school_contact_number',
          label: 'Contact Number',
          placeholder: 'Enter Contact Number',
          type: 'text',
        },
      ],

      collegeStud: [
        {
          name: 'std_qualification',
          label: 'Qualification',
          placeholder: 'Enter Your Qualification',
          type: 'text',
        },
        {
          name: 'name_of_clg',
          label: 'Name Of College',
          placeholder: 'Enter Name Of The College',
          type: 'text',
        },
        {
          name: 'std_email',
          label: 'Student Email',
          placeholder: 'Enter Student Email',
          type: 'text',
        },
        {
          name: 'std_number',
          label: 'Contact Number',
          placeholder: 'Enter Contact Number',
          type: 'text',
        },
      ],

      professionalArtists: [
        {
          name: 'artist_profession',
          label: 'Profession',
          placeholder: 'Enter Your Profession',
          type: 'text',
        },
        {
          name: 'artist_email',
          label: 'Email',
          placeholder: 'Enter Email',
          type: 'text',
        },
        {
          name: 'artist_contact_number',
          label: 'Contact Number',
          placeholder: 'Enter Contact Number',
          type: 'text',
        },
      ],
    },
    2: {
      schoolStud: [
        {
          name: 'school_add',
          label: 'School Correspondence Address',
          placeholder: 'Enter School Correspondence Address',
          type: 'text',
        },
        {
          name: 'country',
          label: 'Select Your Country',
          placeholder: 'Select your country',
          type: 'select',
          opt: countryArr,
        },
        {
          name: 'city',
          label: 'Enter your City',
          placeholder: 'Enter your city',
          type: 'text',
        },
        {
          name: 'dist',
          label: 'Enter your District',
          placeholder: 'Enter your District',
          type: 'text',
          viewableCb: (e: any) => null,
          dependOn: {depend_field: 'country', depend_val: 'IN'},
        },
        {
          name: 'state',
          label: 'Enter your State',
          placeholder: 'Enter your state',
          type: 'text',
          viewableCb: (e: any) => null,
          dependOn: {depend_field: 'country', depend_val: 'IN'},
        },
        {
          name: 'pin',
          label: 'Pin Code',
          placeholder: 'Enter Pin Code',
          type: 'text',
        },
      ],
      collegeStud: [
        {
          name: 'college_add',
          label: 'College Correspondence Address',
          placeholder: 'Enter College Correspondence Address',
          type: 'text',
        },
        {
          name: 'country',
          label: 'Select Your Country',
          placeholder: 'Select your country',
          type: 'select',
          opt: countryArr,
        },
        {
          name: 'city',
          label: 'Enter your City',
          placeholder: 'Enter your city',
          type: 'text',
        },
        {
          name: 'dist',
          label: 'Enter your District',
          placeholder: 'Enter your District',
          type: 'text',
          viewableCb: (e: any) => null,
          dependOn: {depend_field: 'country', depend_val: 'IN'},
        },
        {
          name: 'state',
          label: 'Enter your State',
          placeholder: 'Enter your state',
          type: 'text',
          viewableCb: (e: any) => null,
          dependOn: {depend_field: 'country', depend_val: 'IN'},
        },
        {
          name: 'pin',
          label: 'Pin Code',
          placeholder: 'Enter Pin Code',
          type: 'text',
        },
      ],
      professionalArtists: [
        {
          name: 'college_add',
          label: 'College Address',
          placeholder: 'Enter College Address',
          type: 'text',
        },
        {
          name: 'country',
          label: 'Select Your Country',
          placeholder: 'Select your country',
          type: 'select',
          opt: countryArr,
        },
        {
          name: 'city',
          label: 'Enter your City',
          placeholder: 'Enter your city',
          type: 'text',
        },
        {
          name: 'dist',
          label: 'Enter your District',
          placeholder: 'Enter your District',
          type: 'text',
          viewableCb: (e: any) => null,
          dependOn: {depend_field: 'country', depend_val: 'IN'},
        },
        {
          name: 'state',
          label: 'Enter your State',
          placeholder: 'Enter your state',
          type: 'text',
          viewableCb: (e: any) => null,
          dependOn: {depend_field: 'country', depend_val: 'IN'},
        },
        {
          name: 'pin',
          label: 'Pin Code',
          placeholder: 'Enter Pin Code',
          type: 'text',
        },
      ],
    },
  },
};

export const impNotes: any = {
  national: {
    head: {mainHead: 'School Registration Form Guidelines', subHead: ''},
    body: [
      {
        head: 'Authorized Users',
        content:
          'Only school principals, art teachers, or other designated school authorities are permitted to complete this registration form for their respective students to participate.',
      },
      {
        head: 'Submission Date',
        content:
          'The final date for completing the online registration form till 30th July 2025',
      },
      {
        head: 'Post-Submission Access',
        content:
          'Upon submission of the registration form, you will gain access to view the brochure, participation form, and additional details.',
      },
    ],
  },
  global: {
    head: {mainHead: 'Global Art Exhibition', subHead: ''},
    body: [
      {
        head: 'Open Invitation',
        content:
          'Students, artists or anyone interested in the field of art are warmly welcome to share your artwork with a worldwide audience and earn recognition for your talent!',
      },
      {
        head: 'Post-Registration Access',
        content:
          'Upon submission of the registration form, participants will have access to the following resources.',
      },
      {
        head: 'Post-Submission Access',
        content:
          'Upon submission of the registration form, you will gain access to view the brochure, participation form, and additional details.',
      },
    ],
  },
};

const RegistrationForm = ({props, route, navigation}: any) => {
  const {data} = route.params;
  return (
    <Stack.Navigator
      initialRouteName="FormStep"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="FormStep"
        component={({route, navigation}: any) => (
          <FormStep {...{route, navigation, level: data}} />
        )}
        initialParams={{section: 0}}
      />
    </Stack.Navigator>
  );
};

const FormStep = ({route, navigation, level}: any) => {
  const {authData}: any = useContext(AuthContext);
  const [section, setSection] = useState(route.params?.section);
  const [formData, setFormData]: any = useState([]);
  const [selected, setSelected] = useState('');
  const [loader, setLoader] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  const nationalFormData: any = Object.keys(
    registrationFormFormat.national,
  ).reduce((a: any, c: any) => {
    registrationFormFormat.national[c].forEach((i: any) => (a[i.name] = ''));
    return a;
  }, {});

  const validateCurrentScreen = (item: any) => {
    let _R: any = {};
    const _D =
      level != 'global'
        ? registrationFormFormat[level]?.[item]
        : !item
        ? registrationFormFormat[level]?.[item]
        : registrationFormFormat[level]?.[item][`${selected}`];
    _D.forEach((element: any) => {
      if (element?.name == 'name_of_participant') {
        if (!values[element?.name]?.trim()) {
          _R[element?.name] = "Name of participant can't be blank.";
        } else if (/[^a-zA-Z\s]/.test(values[element?.name])) {
          _R[element?.name] =
            'Name of participant should not contain special characters.';
        }
      }
      if (element?.name == 'dob_of_participant')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "DOB can't be blank.");
      if (element?.name == 'category')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Category can't be blank.");
      if (element?.name == 'class_name')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Class name can't be blank.");
      if (element?.name == 'school_name')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "School name can't be blank.");
      if (element?.name == 'std_qualification')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Qualification can't be blank.");
      if (element?.name == 'name_of_clg')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Collage name can't be blank.");
      if (element?.name == 'artist_profession')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Profession can't be blank.");
      if (element?.name == 'school_add')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Address can't be blank.");
      if (element?.name == 'college_add')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Address can't be blank.");
      if (element?.name == 'country')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Country can't be blank.");
      if (element?.name == 'city')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "City can't be blank.");
      if (element?.name == 'principal_name')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Principal name can't be blank.");
      if (element?.name == 'name_of_art_teacher')
        !values[element?.name]?.trim() &&
          (_R[element?.name] = "Art teacher name can't be blank.");
      if (
        [
          'school_email',
          'std_email',
          'email_of_school',
          'artist_email',
          'art_teacher_email',
        ].includes(element?.name)
      ) {
        if (!values[element?.name]?.trim()) {
          _R[element?.name] = "Email can't be blank.";
        } else if (!/\S+@\S+\.\S+/.test(values[element?.name])) {
          _R[element?.name] = 'Email is invalid.';
        } else if ((values[element?.name].match(/@/g) || []).length > 1) {
          _R[element?.name] = 'Email should contain only one "@" symbol.';
        }
      }
      if (
        [
          'std_number',
          'contact_number_of_school',
          'artist_contact_number',
          'art_teacher_number',
          'school_contact_number',
        ].includes(element?.name)
      ) {
        if (!values[element?.name]?.trim()) {
          _R[element?.name] = "Mobile no. can't be blank.";
        } else if (values[element?.name].length !== 10) {
          _R[element?.name] = 'Mobile no. must be 10 digits long.';
        } else if (!/^[6-9]\d{9}$/.test(values[element?.name])) {
          _R[element?.name] = 'Invalid Mobile no.';
        }
      }
      if (['pin', 'school_pin'].includes(element?.name)) {
        if (!values[element?.name]?.trim()) {
          _R[element?.name] = "Pin Code can't be blank.";
        } else if (!/^\d{6}$/.test(values[element?.name])) {
          _R[element?.name] = 'Invalid pin code';
        }
      }
      setErrors(_R);
    });
    !Object.keys(_R)?.length && setSection(item + 1);
  };

  const globalFormData = Object.keys(registrationFormFormat.global).reduce(
    (a: any, c: any) => {
      if (Array.isArray(registrationFormFormat.global[c])) {
        registrationFormFormat.global[c].forEach((i: any) => (a[i.name] = ''));
      } else {
        registrationFormFormat.global[c][selected]?.forEach(
          (i: any) => (a[i.name] = ''),
        );
      }
      return a;
    },
    {},
  );

  const [formObj, setFormObj] = useState(
    level != 'global' ? nationalFormData : globalFormData,
  );

  const checkCate = (val: any, name: any) =>
    name == 'category' && setSelected(val);

  const submit = async () => {
    setLoader(true);
    const res = await postReq({
      url: 'user-registration',
      data: {
        ...values,
        formType: level != 'global' ? 'N' : 'G',
        userId: authData?.user?.userId,
        formData: JSON.stringify(formData),
      },
    });
    if (res && res?.authdata) {
      littleLegs(200);
      navigation.navigate('UserDashboard', {
        data: {
          level,
          values: {
            ...values,
            formData: JSON.stringify(formData),
            ...res?.authdata,
          },
          userInfo: res?.authdata,
        },
      });
    }
    setLoader(false);
  };

  const validate = (values: any) => {
    let errors: any = {};
    Object.keys(level != 'global' ? formObj : globalFormData).map(
      each =>
        !['state', 'dist', 'honorarium_name'].includes(each) &&
        !values?.[each] &&
        (errors[each] = 'is required'),
    );
    return errors;
  };

  const {handleChange, handleSubmit, values, errors, setErrors, setValues} =
    useForm(submit, validate, formObj);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

  useEffect(() => {
    if (level == 'global') setFormData([...registrationFormFormat[level][0]]);
    if (section == 3 && level == 'global' && selected)
      setFormData([
        ...registrationFormFormat[level][0],
        ...registrationFormFormat[level][1][selected],
        ...registrationFormFormat[level][2][selected],
      ]);
    if (level != 'global')
      setFormData([
        ...registrationFormFormat[level][0],
        ...registrationFormFormat[level][1],
        ...registrationFormFormat[level][2],
      ]);
  }, [section, level]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={style.container}>
        <TouchableOpacity
          onPress={() => {
            section == 0 ? navigation.goBack() : setSection(section - 1);
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-back"
            color="#130F26"
            size={22}
            style={{marginRight: 14}}
          />
          <Text style={[style.fs18, style.boldText, style.textColorBlack]}>
            Registration Form
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 20}}>
          <TermAndCond {...{data: impNotes[level], expanded, setExpanded}} />
        </View>
        <ScrollView>
          {(section < 3
            ? level == 'global' && section > 0
              ? registrationFormFormat[level]?.[section][`${selected}`]
              : registrationFormFormat[level]?.[section]
            : formData
          )?.map(
            ({type, placeholder, label, opt, dependOn, name}: any, i: any) =>
              dependOn?.depend_val == values[dependOn?.depend_field] && (
                <View key={i}>
                  {type == 'text' ? (
                    <Input
                      placeholder={placeholder}
                      errorStyle={{color: 'red'}}
                      errorMessage={errors[name]}
                      label={label}
                      labelStyle={{color: '#001B47', marginBottom: 8}}
                      style={style.formGroup}
                      placeholderTextColor="#0D253C"
                      key={i}
                      onFocus={() => setExpanded(expanded && false)}
                      value={values[name]}
                      onChangeText={val => {
                        handleChange({name, value: val}),
                          setExpanded(expanded && false);
                      }}
                    />
                  ) : type == 'date' ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setExpanded(expanded && false), setOpen(true);
                        }}>
                        <Input
                          placeholder={placeholder}
                          errorStyle={{color: 'red'}}
                          errorMessage={errors[name]}
                          label={label}
                          labelStyle={{color: '#001B47', marginBottom: 8}}
                          style={style.formGroup}
                          placeholderTextColor="#0D253C"
                          key={i}
                          disabled={true}
                          disabledInputStyle={{color: '#000', opacity: 1}}
                          value={values[name]}
                        />
                      </TouchableOpacity>
                      <DatePicker
                        modal
                        mode="date"
                        open={open}
                        date={
                          values[name]
                            ? moment(values[name], [
                                'DD-MMM-yyyy',
                                'DD-MM-YYYY',
                              ]).toDate()
                            : maxDate
                        }
                        onConfirm={date => {
                          setOpen(false);
                          handleChange({
                            name,
                            value: moment(date).format('DD/MMM/YYYY'),
                          });
                        }}
                        onCancel={() => setOpen(false)}
                        maximumDate={maxDate}
                      />
                    </>
                  ) : (
                    <View style={style.selectBox}>
                      <Text style={style.selectLabel}>{`${label}`}</Text>
                      <DropDown
                        {...{
                          data: opt,
                          label,
                          handleChange,
                          name,
                          checkCate,
                          values,
                          errors,
                          setErrors,
                          setExpanded,
                          expanded,
                        }}
                      />
                    </View>
                  )}
                </View>
              ),
          )}
        </ScrollView>

        {section <= 2 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginBottom: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {Array(3)
                .fill()
                .map((e, i) => (
                  <View
                    key={i}
                    style={section == i ? style.redDots : style.blackDots}
                  />
                ))}
            </View>
            <Button
              buttonStyle={{backgroundColor: '#93278f'}}
              titleStyle={{color: '#fff'}}
              title="Next"
              // disabled={!!Object.keys(errors)?.length}
              containerStyle={{
                width: 120,
                borderRadius: 10,
              }}
              onPress={() => {
                validateCurrentScreen(section);
              }}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              buttonStyle={{backgroundColor: '#93278f'}}
              titleStyle={{color: '#fff'}}
              title="Submit"
              disabled={loader}
              containerStyle={{
                width: 120,
                borderRadius: 10,
                marginTop: 3,
              }}
              onPress={e => {
                handleSubmit(e);
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RegistrationForm;
