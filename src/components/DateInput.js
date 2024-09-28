import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import RText from './RText';
import { COLOR } from '../theme/Theme';

const DateInput = ({ value, onChangeText, style, title, titleRequired }) => {
    const [isFocused, setFocused] = useState(false);

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        if (!value) {
            setFocused(false);
        }
    };

    const borderColor = isFocused || value ? COLOR.Jade : COLOR.Grey;

    return (
        <View>
            {title && (
                <RText style={styles.title}>{title}</RText>
            )}
            {titleRequired && (
                <RText style={styles.title}>{titleRequired}<RText style={styles.titleRequired}> *</RText></RText>
            )}
            <MaskInput
                value={value}
                onChangeText={onChangeText}
                mask={Masks.DATE_DDMMYYYY}
                style={[styles.input, style, { borderColor }]}
                keyboardType="numeric"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
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

export default DateInput;
