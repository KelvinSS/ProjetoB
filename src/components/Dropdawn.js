import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { COLOR } from '../theme/Theme';

export default function Dropdown({ selectedValue, onValueChange }) {
    return (
        <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            mode='dropdown'
            style={{ backgroundColor: COLOR.Jade, marginBottom: 15, color: COLOR.White }}
            itemStyle={COLOR.Black}
            selectionColor={COLOR.White}
            dropdownIconColor={COLOR.White}
            dropdownIconRippleColor={COLOR.White}
        >
            <Picker.Item label='Débito' value='Débito' />
            <Picker.Item label='Pix' value='Pix' />
            <Picker.Item label='Crédito' value='Crédito' />
        </Picker>
    );
}
