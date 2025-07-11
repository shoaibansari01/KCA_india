import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const DropDown = ({ data, label, handleChange, name, values, checkCate = () => null, errors, setErrors = () => null, setExpanded = () => null, expanded, autoSearch = true }: any) => {
    return (
        <View>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data ?? []}
                search={autoSearch}
                value={values?.[name]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={label}
                onFocus={() => setExpanded(expanded && false)}
                searchPlaceholder="Search..."
                onChange={e => { handleChange({ value: e.value, name }), checkCate(e.value, name), setExpanded(expanded && false) }}
                itemTextStyle={{ color: '#001B47' }}
                activeColor={'#f4f4f4'}
            />
            {errors?.[name] && <Text style={styles.errorText}>{errors?.[name]}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        // margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: responsiveFontSize(1.856),
    },
    selectedTextStyle: {
        fontSize: responsiveFontSize(1.856),
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: responsiveFontSize(1.856),
    },
    errorText: {
        color: "red",
        fontSize: responsiveFontSize(1.392),
        marginTop: 5
    }
});

export default DropDown