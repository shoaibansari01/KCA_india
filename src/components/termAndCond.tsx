import { View, Text, LayoutAnimation, UIManager, Platform } from 'react-native'
import React, { useState } from 'react'
import { style } from '../style/style'
import { Button } from 'react-native-elements'

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TermAndCond = ({ data, expanded, setExpanded }: any) => {
    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={[style.termAndCond]}>
            <Text style={[style.termAndCond.head]}>{data?.head?.mainHead}</Text>
            {data?.head?.subHead && <Text style={[style.termAndCond.subHead]}>{data?.head?.subHead}</Text>}
            {data?.body.length && <Button
                buttonStyle={{ backgroundColor: 'transparent', padding: 0 }}
                titleStyle={{ color: '#93278f' }}
                title={expanded ? "View Less" : "View More"}
                containerStyle={{
                    width: 120,
                    borderRadius: 10
                }}
                onPress={toggleExpand}
            />}
            {expanded && <View style={[style.termAndCond.data]}>
                {data?.body.length && data?.body.map(({ content, head }: any, i) =>
                    <View key={i}>
                        <Text style={[style.termAndCond.data.head]}>{head} : <Text style={[style.termAndCond.data.content]}>{content}</Text></Text>
                    </View>
                )}
            </View>
            }
        </View>
    )
}

export default TermAndCond