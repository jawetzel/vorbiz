import {KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import React, {useRef} from "react";
import {InputFieldTypes} from "@/models/constants";
import InputError from "@/components/ui/inputs/input-error";
import {CommonInputStyles, InputFieldProps} from "@/components/ui/input-field";
import {themeColors} from "@/components/ui/theme-colors";

const TextInputField: React.FC<InputFieldProps> = ({
                                                    title,
                                                   inputType,
                                                    fieldName,
                                                    value,
                                                    handleChange,
                                                   error
                                                }) => {
    const inputRef = useRef<TextInput | null>(null); // Reference to the input

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
        onPress={() => inputRef.current?.focus()} // Focus input when tapped
    >
        <View style={CommonInputStyles.fieldContainer}>
            {title && title.length > 0 ? <Text style={CommonInputStyles.label}>{title}</Text> : null}
            <View style={styles.textInputContainer}>
                <TextInput
                    ref={inputRef}
                    keyboardType={keyboardType}
                    style={styles.input}
                    value={String(value)}
                    onChangeText={(text) => handleChange(fieldName, text)}
                />
            </View>
            <InputError error={error} />
        </View>
    </TouchableWithoutFeedback>

}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        marginBottom: 0,
        paddingVertical: 4, // Ensures consistent vertical spacing
        paddingHorizontal: 8, // Padding for left and right
        minHeight: 25, // Ensures a visible height
        fontSize: 14, // Readable text size
    },
    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    }
});

export default TextInputField;