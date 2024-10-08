import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLOR } from '../theme/Theme';

export default function ScreenWrapper({ children }) {
    return (
        <View style={styles.container}>
            <View style={styles.component}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR.Background,
        flex: 1,
        padding: 16,
    },
    component: {
        flex: 1,
        justifyContent: "space-between",
    },
});
