import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLOR } from '../theme/Theme';
import Icon from 'react-native-vector-icons/Ionicons';
import RText from './RText';

const FormInput = ({
    value,
    onChangeText,
    style,
    placeholder,
    secureTextEntry,
    keyboardType,
    title,
    titleRequired,
    width = '100%',
    hasError = false,
    textError,
}) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setFocused] = useState(false);

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        if (!value) {
            setFocused(false);
        }
    };

    const borderColor = hasError
        ? COLOR.Red
        : (isFocused || value ? COLOR.Jade : COLOR.Grey);

    return (
        <View style={[styles.container, { width }]}>
            {title && (
                <RText style={styles.title}>{title}</RText>
            )}
            {titleRequired && (
                <RText style={styles.title}>{titleRequired}<RText style={styles.titleRequired}> *</RText></RText>
            )}
            <View style={[styles.inputContainer, { borderColor }]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    style={[styles.input, style]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                    >
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color={COLOR.Jade}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {hasError && (
                <RText style={styles.errorText}>{textError}</RText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        position: 'relative',
        height: 40,
    },
    input: {
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
    errorText: {
        color: COLOR.Red,
        fontSize: 12,
        marginTop: 5,
    },
});

export default FormInput;
