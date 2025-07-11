import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

// Replace this with the correct import path to your image
import NoDataFound from '../assets/images/nodata.jpg';

const NoDataFoundMsg = ({ height = '100%', width = '100%', msg = '' }:any) => {
    return (
        <View style={[styles.container, { height, width }]}>
            <View style={styles.textContainer}>
                {/* <Image source={NoDataFound} style={styles.image} /> */}
                <Text style={styles.message}>{msg.length ? msg : 'No data found !!!'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    image: {
        width: 100, // Adjust width as needed
        height: 100, // Adjust height as needed
        resizeMode: 'contain', // Adjust resize mode as needed
    },
    message: {
        marginTop: 10, // Adjust margin as needed
        textAlign: 'center',
        fontSize: 16, // Adjust font size as needed
        color:"#000"
    },
});

export default NoDataFoundMsg;
