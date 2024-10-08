import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLOR } from '../theme/Theme';
import {
    paymentType,
    recurrent,
    recurrenceInterval,
    status,
    paymentPeriod,
    walletBalance,
    months,
    years,
} from '../utils/dropdownOptions';

export default function Dropdown({ selectedValue, onValueChange, type, title, width = '100%' }) {
    let options = [];

    if (type === 'paymentType') {
        options = paymentType;
    } else if (type === 'recurrent') {
        options = recurrent;
    } else if (type === 'recurrenceInterval') {
        options = recurrenceInterval;
    } else if (type === 'status') {
        options = status;
    } else if (type === 'paymentPeriod') {
        options = paymentPeriod;
    } else if (type === 'walletBalance') {
        options = walletBalance;
    } else if (type === 'months') {
        options = months;
    } else if (type === 'years') {
        options = years;
    }

    return (
        <View style={[styles.container, { width }]}>
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                mode='dropdown'
                style={styles.picker}
                dropdownIconColor={COLOR.White}
            >
                {options.map((option, index) => (
                    <Picker.Item key={index} label={option.label} value={option.value} />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        backgroundColor: COLOR.Jade,
        color: COLOR.White,
        marginBottom: 10,
    },
    container: {
        width: '100%',
    },
});
