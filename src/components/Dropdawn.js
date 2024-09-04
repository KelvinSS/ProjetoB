import React from 'react';
import { Picker } from '@react-native-picker/picker';

export default function Dropdown({ selectedValue, onValueChange }) {
    return (
        <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            mode='dropdown'
            style={{ backgroundColor: '#ccc', marginBottom: 15 }}
        >
            <Picker.Item label='Débito' value='Débito' />
            <Picker.Item label='Pix' value='Pix' />
            <Picker.Item label='Crédito' value='Crédito' />
        </Picker>
    );
}
