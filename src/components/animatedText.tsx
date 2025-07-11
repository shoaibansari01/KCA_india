import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const AnimatedText = ({ name, color, size, style }: any) => {
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1.1,
                        duration: 900,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 900,
                        easing: Easing.linear,
                        useNativeDriver: true
                    })
                ])
            ).start();
        };

        startAnimation();
    }, [animatedValue]);

    return (
        <Animated.View style={{
            transform: [{ scale: animatedValue }],
            display: "flex",
            alignItems: "center"
        }}>
             <Text style={{ color: "#fff",
        fontWeight: "bold",}}>{name}</Text>
        </Animated.View>
    );
};
