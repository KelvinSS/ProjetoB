import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { COLOR } from '../theme/Theme';

const MoneyInput = ({ value, onChangeText, style, title, titleRequired }) => {
    return (
        <View>
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}
            {titleRequired && (
                <Text style={styles.title}>{titleRequired}<Text style={styles.titleRequired}> *</Text></Text>
            )}
            <MaskInput
                value={value}
                onChangeText={onChangeText}
                mask={Masks.BRL_CURRENCY}
                style={[styles.input, style]}
                keyboardType="numeric"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: COLOR.Jade,
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 4,
        fontSize: 16,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    titleRequired: {
        fontSize: 16,
        marginBottom: 5,
        color: COLOR.Red,
        fontWeight: 'bold',
    },
});

export default MoneyInput;
