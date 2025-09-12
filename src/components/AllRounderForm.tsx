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
  { value: 'Nursery', label: 'Nursery' },
  { value: 'KG', label: 'KG-1 & KG-2' },
  { value: 'Class1-2', label: '1st & 2nd' },
  { value: 'Class3-4', label: '3rd & 4th' },
  { value: 'Class5-6', label: '5th & 6th' },
  { value: 'Class7-8', label: '7th & 8th' },
  { value: 'Class9-10', label: '9th & 10th' },
];

// Age Options (3-15 years)
const ageOptions = Array.from({ length: 13 }, (_, i) => ({
  value: (i + 3).toString(),
  label: `${i + 3} year${i + 3 > 1 ? 's' : ''}`,
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

// Fee per talent
const TALENT_FEE = 60;

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
    talent_categories: [] as string[],
    parent_name: '',
    email_id: '',
    whatsapp_number: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string | string[]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTalentToggle = (talentValue: string) => {
    const currentTalents = values.talent_categories;
    let newTalents;
    
    if (currentTalents.includes(talentValue)) {
      newTalents = currentTalents.filter(t => t !== talentValue);
    } else {
      newTalents = [...currentTalents, talentValue];
    }
    
    handleChange('talent_categories', newTalents);
  };

  const calculateTotalFee = () => {
    return values.talent_categories.length * TALENT_FEE;
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
    if (values.talent_categories.length === 0) {
      newErrors.talent_categories = 'At least one talent category is required';
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

  const handlePayment = async () => {
    if (!validate()) return;
    
    const totalFee = calculateTotalFee();
    
    Alert.alert(
      'Payment Confirmation',
      `Total Fee: ₹${totalFee}\nSelected Talents: ${values.talent_categories.length}\nFees Per Talent: ₹${TALENT_FEE}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Pay Now',
          onPress: () => processPayment(totalFee),
        },
      ]
    );
  };

  const processPayment = async (totalFee: number) => {
    setLoading(true);
    try {
      navigation.navigate('AllRounderPaymentScreen', {
        formData: values,
        totalFee,
        selectedTalents: values.talent_categories,
      });
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed. Please try again.');
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
             Registration Form
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
            <Text style={style.selectLabel}>Categories</Text>
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
            <Text style={style.selectLabel}>Age (from 3 year to 15 years)</Text>
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
            <Text style={style.selectLabel}>Select as per your Talent (Multiple selection allowed)</Text>
            <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
              ₹{TALENT_FEE} per talent • Selected: {values.talent_categories.length} • Total: ₹{calculateTotalFee()}
            </Text>
            {talentOptions.map((talent) => (
              <TouchableOpacity
                key={talent.value}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  marginBottom: 8,
                  backgroundColor: values.talent_categories.includes(talent.value) ? '#E0E7FF' : 'white',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: values.talent_categories.includes(talent.value) ? '#4F46E5' : '#D1D5DB',
                }}
                onPress={() => handleTalentToggle(talent.value)}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: values.talent_categories.includes(talent.value) ? '#4F46E5' : '#D1D5DB',
                    borderRadius: 3,
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: values.talent_categories.includes(talent.value) ? '#4F46E5' : 'white',
                  }}
                >
                  {values.talent_categories.includes(talent.value) && (
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                  )}
                </View>
                <Text style={{
                  flex: 1,
                  fontSize: 16,
                  color: values.talent_categories.includes(talent.value) ? '#4F46E5' : '#374151',
                  fontWeight: values.talent_categories.includes(talent.value) ? '600' : '400',
                }}>
                  {talent.label}
                </Text>
              </TouchableOpacity>
            ))}
            {errors.talent_categories && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.talent_categories}</Text>
            )}
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

          {values.talent_categories.length > 0 && (
            <View style={{
              backgroundColor: '#F3F4F6',
              padding: 15,
              borderRadius: 10,
              marginVertical: 10,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 8,
              }}>
                Payment Summary
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                Selected Talents: {values.talent_categories.length}
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                Fees per talents: ₹{TALENT_FEE}
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#10B981',
                marginTop: 8,
              }}>
                Total Amount: ₹{calculateTotalFee()}
              </Text>
            </View>
          )}

          <Button
            title={loading ? 'Processing...' : `Pay ₹${calculateTotalFee()}`}
            onPress={handlePayment}
            disabled={loading || values.talent_categories.length === 0}
            buttonStyle={{ 
              backgroundColor: values.talent_categories.length > 0 ? '#10B981' : '#93278f', 
              marginTop: 20 
            }}
            titleStyle={{ color: '#fff' }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AllRounderForm;