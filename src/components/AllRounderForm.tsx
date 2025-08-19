import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { style } from '../style/style';
import { AuthContext } from '../helper/contex';
import { postReq } from '../helper/http';
import { littleLegs } from '../helper/reusableFun';
import DropDown from './dropDown';

// Class Options
const classOptions = [
  {value: 'PreNursery', label: 'Pre-Nursery'},
  {value: 'Nursery', label: 'Nursery'},
  {value: 'LKG', label: 'LKG'},
  {value: 'UKG', label: 'UKG'},
  {value: 'Class1', label: 'Class 1st'},
  {value: 'Class2', label: 'Class 2nd'},
  {value: 'Class3', label: 'Class 3rd'},
  {value: 'Class4', label: 'Class 4th'},
  {value: 'Class5', label: 'Class 5th'},
  {value: 'Class6', label: 'Class 6th'},
  {value: 'Class7', label: 'Class 7th'},
  {value: 'Class8', label: 'Class 8th'},
  {value: 'Class9', label: 'Class 9th'},
  {value: 'Class10', label: 'Class 10th'},
];

// Age Options (1-15 years)
const ageOptions = Array.from({length: 15}, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1} year${i + 1 > 1 ? 's' : ''}`,
}));

// Talent Awards Options
const talentOptions = [
  {value: 'bestChildArtist', label: 'Best Child Artist Award'},
  {value: 'bestChildAnchor', label: 'Best Child Anchor Award'},
  {value: 'bestChildDancer', label: 'Best Child Dancer Award'},
  {value: 'bestChildFamilyConversation', label: 'Best Child Family Conversation Award'},
  {value: 'bestChildMusician', label: 'Best Child Musician Award'},
  {value: 'bestChildRampWalker', label: 'Best Child Ramp Walker Award'},
  {value: 'bestChildSinger', label: 'Best Child Singer Award'},
  {value: 'bestChildStoryteller', label: 'Best Child Storyteller Award'},
  {value: 'bestShlokaReciter', label: 'Best Shloka Reciter Award'},
  {value: 'bestChildSelfIntroduction', label: 'Best Child Self Introduction Award'},
];

const AllRounderForm = ({ navigation }: any) => {
  const { authData }: any = useContext(AuthContext);
  const [values, setValues] = useState({
    name_of_participant: '',
    school_name: '',
    city: '',
    dist: '',
    state: '',
    school_pin: '',
    class_name: '',
    age: '',
    talent_category: '',
    parent_name: '',
    email_id: '',
    whatsapp_number: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: any = {};
    
    // Required fields validation
    if (!values.name_of_participant.trim()) {
      newErrors.name_of_participant = 'Participant name is required';
    }
    if (!values.school_name.trim()) {
      newErrors.school_name = 'School name is required';
    }
    if (!values.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!values.dist.trim()) {
      newErrors.dist = 'District is required';
    }
    if (!values.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!values.school_pin.trim()) {
      newErrors.school_pin = 'Pin code is required';
    } else if (!/^\d{6}$/.test(values.school_pin)) {
      newErrors.school_pin = 'Invalid pin code (6 digits required)';
    }
    if (!values.class_name) {
      newErrors.class_name = 'Class is required';
    }
    if (!values.age) {
      newErrors.age = 'Age is required';
    }
    if (!values.talent_category) {
      newErrors.talent_category = 'Talent category is required';
    }
    if (!values.parent_name.trim()) {
      newErrors.parent_name = 'Parent name is required';
    }
    if (!values.whatsapp_number.trim()) {
      newErrors.whatsapp_number = 'WhatsApp number is required';
    } else if (!/^[6-9]\d{9}$/.test(values.whatsapp_number)) {
      newErrors.whatsapp_number = 'Invalid WhatsApp number (10 digits, starting with 6-9)';
    }
    
    // Email validation (optional field)
    if (values.email_id.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email_id)) {
      newErrors.email_id = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await postReq({
        url: 'user-registration',
        data: {
          ...values,
          formType: 'A',
          userId: authData?.user?.userId,
        },
      });
      
      if (res && res?.authdata) {
        littleLegs(200);
        navigation.navigate('UserDashboard', {
          data: {
            level: 'allrounder',
            values: { ...values, ...res?.authdata },
            userInfo: res?.authdata,
          },
        });
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14 }} />
          <Text style={[style.fs18, style.boldText, style.textColorBlack]}>
            All Rounder Talent Hub Contest Registration
          </Text>
        </TouchableOpacity>

        <ScrollView>
          <Input
            placeholder="Enter participant name"
            label="Name of the Participant"
            value={values.name_of_participant}
            onChangeText={(text) => handleChange('name_of_participant', text)}
            errorMessage={errors.name_of_participant as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
          />

          <Input
            placeholder="Enter school name"
            label="Name of the school"
            value={values.school_name}
            onChangeText={(text) => handleChange('school_name', text)}
            errorMessage={errors.school_name as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
          />

          <Input
            placeholder="Enter city"
            label="City"
            value={values.city}
            onChangeText={(text) => handleChange('city', text)}
            errorMessage={errors.city as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
          />

          <Input
            placeholder="Enter district"
            label="District"
            value={values.dist}
            onChangeText={(text) => handleChange('dist', text)}
            errorMessage={errors.dist as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
          />

          <Input
            placeholder="Enter state"
            label="State"
            value={values.state}
            onChangeText={(text) => handleChange('state', text)}
            errorMessage={errors.state as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
          />

          <Input
            placeholder="Enter pin code"
            label="Pin"
            value={values.school_pin}
            onChangeText={(text) => handleChange('school_pin', text)}
            errorMessage={errors.school_pin as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
            keyboardType="numeric"
          />

          <View style={style.selectBox}>
            <Text style={style.selectLabel}>Class (dropdown)</Text>
            <DropDown
              data={classOptions}
              label="Class"
              handleChange={({name, value}: any) => handleChange(name, value)}
              name="class_name"
              placeholder="Select class"
              value={values.class_name}
              error={errors.class_name}
            />
          </View>

          <View style={style.selectBox}>
            <Text style={style.selectLabel}>Age (dropdown from 1year to 15 years)</Text>
            <DropDown
              data={ageOptions}
              label="Age"
              handleChange={({name, value}: any) => handleChange(name, value)}
              name="age"
              placeholder="Select age"
              value={values.age}
              error={errors.age}
            />
          </View>

          <View style={style.selectBox}>
            <Text style={style.selectLabel}>Select as per your Talent</Text>
            <DropDown
              data={talentOptions}
              label="Talent Category"
              handleChange={({name, value}: any) => handleChange(name, value)}
              name="talent_category"
              placeholder="Select talent category"
              value={values.talent_category}
              error={errors.talent_category}
            />
          </View>

          <Input
            placeholder="Enter parent name"
            label="Name of the Parent"
            value={values.parent_name}
            onChangeText={(text) => handleChange('parent_name', text)}
            errorMessage={errors.parent_name as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
          />

          <Input
            placeholder="Enter email address"
            label="Email-id (if any)"
            value={values.email_id}
            onChangeText={(text) => handleChange('email_id', text)}
            errorMessage={errors.email_id as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
            keyboardType="email-address"
          />

          <Input
            placeholder="Enter WhatsApp number"
            label="Whatsapp Number"
            value={values.whatsapp_number}
            onChangeText={(text) => handleChange('whatsapp_number', text)}
            errorMessage={errors.whatsapp_number as string}
            labelStyle={{ color: '#001B47', marginBottom: 8 }}
            style={style.formGroup}
            keyboardType="phone-pad"
          />

          <Button
            title={loading ? 'Submitting...' : 'Submit Registration'}
            onPress={handleSubmit}
            disabled={loading}
            buttonStyle={{ backgroundColor: '#93278f', marginTop: 20 }}
            titleStyle={{ color: '#fff' }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AllRounderForm;