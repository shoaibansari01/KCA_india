import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const AnimatedIcon = ({ name, color, size, style }: any) => {
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1.2,
                        duration: 500,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 500,
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
            <Icon name={name} color={color} size={size} style={style} />
        </Animated.View>
    );
};
