import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLOR } from '../theme/Theme';
import Icon from 'react-native-vector-icons/Ionicons';

const FormInput = ({
    value,
    onChangeText,
    style,
    placeholder,
    secureTextEntry,
    keyboardType,
    title,
    titleRequired
}) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}
            {titleRequired && (
                <Text style={styles.title}>{titleRequired}<Text style={styles.titleRequired}> *</Text></Text>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    style={[styles.input, style]}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                    >
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={24}
                            color={COLOR.Jade}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        borderColor: COLOR.Jade,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        fontSize: 16,
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
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

export default FormInput;