import React from 'react';
import { View, StyleSheet } from 'react-native';

const SkeletonLoader = () => {
    return (
        <View style={styles.skeletonContainer}>
            <View style={styles.skeletonItem}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
            </View>
            <View style={styles.skeletonItem}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonText} />
                <View style={styles.skeletonButton} />
            </View>
            {/* Add more skeleton items if needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonContainer: {
        width: '100%',
        padding: 20,
        margin: 0,
    },
    skeletonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    skeletonIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e0e0e0',
        marginRight: 14,
    },
    skeletonText: {
        width: 120,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
    },
    skeletonButton: {
        width: 60,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
});

export default SkeletonLoader;
