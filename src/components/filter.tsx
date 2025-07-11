import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { style } from '../style/style'
import { Input } from 'react-native-elements'

const Filter = () => {
    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <View style={style.filter}>
                    <Input
                        placeholder='Search art here'
                        // style={style.filterFormGroup}
                        // labelStyle={{ color: '#001B47', fontSize: 8, padding: 30 }}
                        placeholderTextColor="#0D253C"
                        // leftIcon={{ type: 'Icon', name: 'search', size: 35 }}
                        // inputContainerStyle={{ borderBottomWidth: 0 }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Filter