import {KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import React, {useRef} from "react";
import {InputFieldTypes} from "@/models/constants";
import InputError from "@/components/ui/inputs/input-error";
import {themeColors} from "@/constants/theme-colors";
import {InputDecorators, InputFieldProps} from "@/components/ui/inputs/input-typings";
import {CommonInputStyles} from "@/components/ui/inputs/input-styles";

const NumberInputField: React.FC<InputFieldProps> = ({
                                                    title,
                                                   inputType,
                                                    fieldName,
                                                    value,
                                                    handleChange,
                                                   error
                                                }) => {
    const inputRef = useRef<TextInput | null>(null);

    let keyboardType = "default" as KeyboardTypeOptions;
    if(inputType){
        switch (inputType){
            case InputFieldTypes.decimal: {
                keyboardType = 'decimal-pad';
                break;
            }
            case InputFieldTypes.money:{
                keyboardType = 'decimal-pad';
                break;
            }
            case InputFieldTypes.numeric:{
                keyboardType = 'number-pad';
                break;
            }
            case InputFieldTypes.percent:{
                keyboardType = 'decimal-pad';
                break;
            }
            case InputFieldTypes.phone:{
                keyboardType = 'phone-pad';
                break;
            }
            case InputFieldTypes.email:{
                keyboardType = 'email-address'
            }
        }
    }


    return <TouchableWithoutFeedback
        onPress={() => inputRef.current?.focus()}
    >
        <View style={CommonInputStyles.fieldContainer}>
            {title && title.length > 0 ? <Text style={CommonInputStyles.label}>{title}</Text> : null}
            <View style={styles.textInputContainer}>
                {inputType && InputDecorators.money === inputType &&
                    <View style={styles.percentContainer}>
                        <Text style={styles.percentText}>$</Text>
                    </View>
                }
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={String(value)}
                    keyboardType={keyboardType}
                    onChangeText={(text) => {
                        if (/^(\d+(\.\d*)?|\.\d*)?$/.test(text)) {
                            handleChange(fieldName, text);
                        }
                    }}
                    onBlur={() => {
                        const currentValue = value;
                        if (typeof currentValue === 'string') {
                            const numericValue = parseFloat(currentValue);
                            handleChange(fieldName, isNaN(numericValue) ? 0 : numericValue);
                        }
                    }}
                />
                {inputType && InputDecorators.percentage === inputType &&
                    <View style={styles.percentContainer}>
                        <Text style={styles.percentText}>%</Text>
                    </View>
                }
            </View>
            <InputError error={error} />
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        marginBottom: 0,
        paddingVertical: 4,
        paddingHorizontal: 8,
        minHeight: 25,
        fontSize: 14,
    },

    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    },
    percentContainer: {
        backgroundColor: themeColors.borders,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderLeftWidth: 1,
        borderLeftColor: themeColors.borders,
    },
    percentText: {
        color: '#666',
        fontSize: 16,
    },

});

export default NumberInputField;