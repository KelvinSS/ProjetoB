import { View, Text, StyleSheet, TextInput } from 'react-native';
import { COLOR } from '../theme/Theme';


const InputStyle = ({ value, onChangeText, style, placeholder, secureTextEntry, keyboardType }) => {
    return (
        <TextInput
            value={value}
            onChange={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            style={[styles.input, style]}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        borderColor: COLOR.Jade,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,

        fontSize: 16,
        marginBottom: 10,
    },
});

export default InputStyle;