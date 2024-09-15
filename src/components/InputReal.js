import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { COLOR } from '../theme/Theme';

const InputReal = ({ value, onChangeText, style }) => {
    return (
        <MaskInput
            value={value}
            onChangeText={onChangeText} // Usa a função handleChange para manipular o texto
            mask={Masks.BRL_CURRENCY} // Máscara para moeda brasileira
            style={[styles.input, style]}
            keyboardType="numeric"
        />
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
});

export default InputReal;
