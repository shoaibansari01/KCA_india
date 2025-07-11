import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const ResultPage = () => {
    return (
        <View>
            <View style={{ width: '100%', height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CDDFFF' }}>
                <View style={{ width: '90%', padding: 5, alignItems: "center" }}>
                    <TouchableOpacity>
                        <Text style={{ color: '#000', fontWeight: "500", fontSize: responsiveFontSize(2) }}>VIEW ALL KCA HIGHLIGHTS</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export const openPDF = () => {
    const pdfUrl = 'https://kca-bucket.s3.ap-south-1.amazonaws.com/result_25_2024/Final_Result_2024.pdf';
    Linking.openURL(pdfUrl).catch((err) => {
        console.error("Failed to open URL: ", err);
    });
};

export default ResultPage;
