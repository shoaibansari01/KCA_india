import React, { useContext, useState } from 'react'
import { SafeAreaView, TouchableOpacity, View, ScrollView, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button, Input, Text } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import DropDown from '../../components/dropDown';
import { style } from '../../style/style';
import moment from 'moment';
import useForm from '../../hook/useForm';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { postReq } from '../../helper/http';
import { AuthContext } from '../../helper/contex';
import { littleLegs } from '../../helper/reusableFun';
import DocumentPicker from 'react-native-document-picker';
import { regexValidate } from '../../helper/regxData';

const formFields = [
    {
        section: "Participants Information",
        fields: [
            { label: "Full Name of Participant", name: "name", type: "text", required: true },
            { label: "Date of Birth", name: "date_of_brith", type: "date", required: true },
            { label: "Gender", name: "gender", type: "select", opt: [{ value: 'm', label: 'Male' }, { value: 'f', label: 'Female' }], required: true },
            { label: "School Address/College Address", name: "school_address", type: "text", required: true },
            { label: "City", name: "city", type: "text", required: true },
            { label: "State", name: "state", type: "text", required: true },
            { label: "Pin Code", name: "pin_code", type: "text", required: true }
        ],
    },
    {
        section: "Parent/Guardian Information",
        fields: [
            { label: "Full Name", name: "parent_name", type: "text", required: true },
            { label: "Contact Number (Parents/Guardian/Participants)", name: "parent_number", type: "text", required: true },
            { label: "Email", name: "parent_email", type: "text", required: true },
        ],
    },
    {
        section: "Choose the category your child comes under to apply for NKAGA",
        fields: [
            {
                label: "Academics", name: "academics", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "mathematics", label: "Mathematics" },
                    { value: "science", label: "Science" },
                    { value: "general_knowledge", label: "General Knowledge" },
                    { value: "history", label: "History" },
                    { value: "geography", label: "Geography" },
                    { value: "languages", label: "Languages" }
                ]
            },
            {
                label: "Arts", name: "arts", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "painting", label: "Painting" },
                    { value: "drawing", label: "Drawing" },
                    { value: "sculpture", label: "Sculpture" },
                    { value: "craft", label: "Craft" },
                    { value: "photography", label: "Photography" },
                    { value: "digital_art", label: "Digital Art" },
                    { value: "animation", label: "Animation" }
                ]
            },
            {
                label: "Performing Arts", name: "performing_arts", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "music", label: "Music (Vocal and Instrumental)" },
                    { value: "dance", label: "Dance (Classical, Contemporary, Folk)" },
                    { value: "drama", label: "Drama" },
                    { value: "poetry_recitation", label: "Poetry Recitation" },
                    { value: "magic", label: "Magic" }
                ]
            },
            {
                label: "Sports", name: "sports", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "individual_sports", label: "Individual Sports (e.g., Tennis, Swimming, Gymnastics)" },
                    { value: "team_sports", label: "Team Sports (e.g., Soccer, Basketball, Cricket)" },
                    { value: "martial_arts", label: "Martial Arts" },
                    { value: "track_field", label: "Track and Field" },
                    { value: "chess", label: "Chess" }
                ]
            },
            {
                label: "Science and Technology", name: "science_technology", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "innovation", label: "Innovation" },
                    { value: "robotics", label: "Robotics" },
                    { value: "coding_programming", label: "Coding and Programming" },
                    { value: "scientific_research", label: "Scientific Research" },
                    { value: "engineering_projects", label: "Engineering Projects" },
                    { value: "space_science", label: "Space Science" }
                ]
            },
            {
                label: "Social Service", name: "social_service", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "community_service", label: "Community Service" },
                    { value: "environmental_initiatives", label: "Environmental Initiatives" },
                    { value: "volunteering", label: "Volunteering" },
                    { value: "fundraising", label: "Fundraising for Charitable Causes" },
                    { value: "social_entrepreneurship", label: "Social Entrepreneurship" }
                ]
            },
            {
                label: "Leadership", name: "leadership", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "school_leadership", label: "School Leadership" },
                    { value: "community_leadership", label: "Community Leadership" },
                    { value: "entrepreneurship", label: "Entrepreneurship" },
                    { value: "youth_advocacy", label: "Youth Advocacy" }
                ]
            },
            {
                label: "Special Skills", name: "special_skills", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "culinary_arts", label: "Culinary Arts" },
                    { value: "public_speaking", label: "Public Speaking" },
                    { value: "debate", label: "Debate" },
                    { value: "creative_writing", label: "Creative Writing" },
                    { value: "blogging_vlogging", label: "Blogging and Vlogging" },
                    { value: "fashion_design", label: "Fashion Design" }
                ]
            },
            {
                label: "Cultural Heritage", name: "cultural_heritage", type: "select", opt: [
                    { value: null, label: 'None' },
                    { value: "traditional_art_forms", label: "Traditional Art Forms" },
                    { value: "classical_dance", label: "Classical Dance" },
                    { value: "folk_music", label: "Folk Music" },
                    { value: "cultural_projects", label: "Cultural Projects and Research" },
                    { value: "heritage_conservation", label: "Heritage Conservation" }
                ]
            },
            { label: "Others", name: "others_category", type: "text" },
        ]
    }
];

export const notReq = [
    "academics",
    "arts",
    "performing_arts",
    "sports",
    "science_technology",
    "social_service",
    "leadership",
    "special_skills",
    "cultural_heritage",
    "others_category"
]

const NominiForm = ({ navigation }: any) => {
    const { authData }: any = useContext(AuthContext);
    const [formObj, setFormObj] = useState(formFields.reduce((a, c) => {
        a = {
            ...a, ...c.fields?.reduce((s: any, b: any) => {
                s[b?.name] = ''
                return s
            }, {})
        }
        return a
    }, { profileInBrief: "" }));
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [fileResponse, setFileResponse]: any = useState(null);
    const [fileErr, setFileErr]: any = useState('');
    const [catErr, setCatErr]: any = useState('');

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1);

    const submit = async () => {
        const _ = notReq.reduce((a: any, c: any) => {
            if (values[c]) a.push(c)
            return a;
        }, [])
        if (!_?.length) return setCatErr("At least one category is required.");
        if (_?.length) setCatErr("");
        if (!fileResponse) return setFileErr(`profile-File is Required`);
        navigation.navigate('NominiPaymentSection', { data: { values, fileData: fileResponse } });
    }
    const validate = (values: any) => {
        let errors: any = {};
        Object.keys(formObj).map(each => (!notReq.includes(each) && !values?.[each].trim() && (errors[each] = "is required")));
        if (values?.pin_code && !regexValidate('pin_code').test(values?.pin_code)) (errors.pin_code = "Invalid Pin Code");
        if (values?.parent_number && !regexValidate('parent_number').test(values?.parent_number)) (errors.parent_number = "Invalid Number");
        if (values?.parent_email && !regexValidate('parent_email').test(values?.parent_email)) (errors.parent_email = "Invalid Email");
        if (!values?.profileInBrief) (errors.profileInBrief = "Participants Profile in brief is required");
        return errors
    }

    const { handleChange, handleSubmit, values, errors, setErrors, setValues } = useForm(
        submit,
        validate,
        formObj
    );
    console.log(errors, "errors");

    const handleDocumentPicker = async (typeOfD: any) => {
        try {
            const res: any = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (['png', 'jpg', 'jpeg', "pdf"].includes(res[0]?.name.split(".").pop().toLowerCase())) {
                setFileResponse((pre: any) => ({ ...(pre ?? {}), [typeOfD]: res }));
            } else {
                setFileResponse(null);
                Alert.alert('Invalid File', 'Please select an .png,.jpeg,.png,.pdf file.');
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


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="arrow-back" color="#130F26" size={22} style={{ marginRight: 14, fontWeight: "bold" }} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: responsiveFontSize(2.5), textAlign: "center", color: "#001B47", fontWeight: "bold", marginBottom: 10 }}>NOMINATION FORM</Text>
                    <View style={{ height: responsiveHeight(80) }}>
                        <ScrollView>
                            <View style={{}}>
                                {formFields?.map((e) =>
                                    <View >
                                        <Text style={{ fontSize: responsiveFontSize(2.2), color: "#001B47", fontWeight: "bold", marginBottom: 10 }}>{e?.section} :</Text>
                                        {e?.fields?.map((sub, idx) =>
                                            sub?.type == "text" ? <Input
                                                placeholder={`Enter ${sub?.label}`.slice(0, 40)}
                                                errorStyle={{ color: 'red' }}
                                                errorMessage={errors[sub?.name]}
                                                label={sub?.label}
                                                labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                                style={style.formGroup}
                                                placeholderTextColor="#0D253C"
                                                onFocus={() => setExpanded(expanded && false)}
                                                value={values[sub?.name]}
                                                onChangeText={(val) => { handleChange({ name: sub?.name, value: val }), setExpanded(expanded && false) }}
                                            /> : sub?.type == "date" ? <>
                                                <TouchableOpacity onPress={() => { setExpanded(expanded && false), setOpen(true) }}>
                                                    <Input
                                                        placeholder={`Enter ${sub?.label}`}
                                                        errorStyle={{ color: 'red' }}
                                                        errorMessage={errors[sub?.name]}
                                                        label={sub?.label}
                                                        labelStyle={{ color: '#001B47', marginBottom: 8 }}
                                                        style={style.formGroup}
                                                        placeholderTextColor="#0D253C"
                                                        disabled={true}
                                                        disabledInputStyle={{ color: "#000", opacity: 1 }}
                                                        value={values[sub?.name]}
                                                    />
                                                </TouchableOpacity>
                                                <DatePicker
                                                    modal
                                                    mode="date"
                                                    open={open}
                                                    date={values[sub?.name] ? moment(values[sub?.name], ["DD-MMM-yyyy", "DD-MM-YYYY"]).toDate() : maxDate}
                                                    onConfirm={(date) => {
                                                        setOpen(false)
                                                        handleChange({ name: sub?.name, value: moment(date).format('DD/MMM/YYYY') })
                                                    }}
                                                    onCancel={() => setOpen(false)}
                                                    maximumDate={maxDate}
                                                />
                                            </> : <View style={style.selectBox}>
                                                <Text style={style.selectLabel}>{`${sub?.label}`}</Text>
                                                <DropDown {...{ data: sub?.opt, label: `Select`, handleChange, name: sub?.name, values, errors, setExpanded, expanded, autoSearch: false }} />
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                            <Input
                                placeholder={`Enter Participants Profile in brief`}
                                errorStyle={{ color: 'red' }}
                                errorMessage={errors[`profileInBrief`]}
                                label={`Share Participants Profile in brief`}
                                labelStyle={{ color: '#001B47', marginBottom: 8, marginHorizontal: 0, paddingHorizontal: 0 }}
                                style={[style.formGroup, { marginHorizontal: 0, paddingHorizontal: 0 }]}
                                placeholderTextColor="#0D253C"
                                onFocus={() => setExpanded(expanded && false)}
                                value={values[`profileInBrief`]}
                                onChangeText={(val) => { handleChange({ name: `profileInBrief`, value: val }), setExpanded(expanded && false) }}
                            />
                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={styles.subText} >Participant's Profile</Text>
                                <TouchableOpacity style={[style.uploaddatadashBorder, { padding: 10 }]} onPress={() => handleDocumentPicker("profile")}>
                                    <Text style={style.uploaddataDragDrop}>Upload File +</Text>
                                </TouchableOpacity>
                                {!!fileErr?.length && fileErr.includes("profile") && <Text style={[style.errorText, { fontSize: responsiveFontSize(1.6) }]}>{fileErr.split("-").pop()}</Text>}
                                {fileResponse?.['profile']?.[0]?.name && <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 10 }}>
                                    <Icon name="file-present" color="#18701f" size={25} style={{ marginRight: 14 }} />
                                    <Text style={{ fontSize: responsiveFontSize(1.74), fontWeight: "bold" }}>{fileResponse?.[0]?.name}</Text>
                                </View>}

                                <Text>Upload supported file upto 15 MB</Text>

                                <Text style={styles.subText} >Participant's Photograph</Text>
                                <TouchableOpacity style={[style.uploaddatadashBorder, { padding: 10 }]} onPress={() => handleDocumentPicker("photo")}>
                                    <Text style={style.uploaddataDragDrop}>Upload File +</Text>
                                </TouchableOpacity>
                                {!!fileErr?.length && fileErr.includes("photo") && <Text style={[style.errorText, { fontSize: responsiveFontSize(1.6) }]}>{fileErr}</Text>}
                                {fileResponse?.['photo']?.[0]?.name && <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 10 }}>
                                    <Icon name="file-present" color="#18701f" size={25} style={{ marginRight: 14 }} />
                                    <Text style={{ fontSize: responsiveFontSize(1.74), fontWeight: "bold" }}>{fileResponse?.[0]?.name}</Text>
                                </View>}
                                <Text>Upload supported file upto 15 MB</Text>
                            </View>
                            {!!catErr?.length && <View style={{ paddingHorizontal: 20 }}>
                                <Text style={[style.errorText, { fontSize: responsiveFontSize(1.6) }]}>{catErr}</Text>
                            </View>}
                            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}><Button
                                buttonStyle={{ backgroundColor: '#93278f' }}
                                titleStyle={{ color: '#fff' }}
                                title="Pay"
                                disabled={loader}
                                containerStyle={{
                                    width: 120,
                                    borderRadius: 10,
                                    marginTop: 3
                                }}
                                onPress={(e) => { handleSubmit(e) }}
                            /></View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#001B47'
    },
    bold: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold',
        color: '#93278f'
    },
    subText: {
        fontSize: responsiveFontSize(1.9),
        fontWeight: 'bold',
        color: '#001B47',
        marginBottom: 10
    }
});


export default NominiForm
