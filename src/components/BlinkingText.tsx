import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';

export const BlinkingText = () => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        );
        blink.start();
        return () => blink.stop();
    }, [opacity]);

    return (
        <View style={styles.container}>
            <View style={{ marginLeft: 6, flexDirection: "row", alignItems: "center" }}>
                <Animated.Text style={[styles.clickHere, { opacity, }]}>
                    <Text>Click here</Text>
                </Animated.Text>
                <Animated.Text style={[styles.clickHere, { opacity, }]}>
                    <Icon name="arrow-forward" color="#93278f" size={22} style={{ marginRight: 14 }} />
                </Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    clickHere: {
        fontSize: responsiveFontSize(1.856),
        marginEnd: 10,
        color: '#93278f',
    },
});

export const BlinkingTextTwo = ({ children }) => {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.5,  // Adjusts the lowest opacity value (half transparent)
                    duration: 1000,  // Duration for fade out
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,  // Fully visible again
                    duration: 1000,  // Duration for fade in
                    useNativeDriver: true,
                }),
            ])
        );
        blink.start();
        return () => blink.stop();
    }, [opacity]);

    return (
        <Animated.Text style={{ opacity, color: "#93278f", fontWeight: "600", marginBottom: 5 }}>
            {children}
        </Animated.Text>
    );
};

