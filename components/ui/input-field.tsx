import {KeyboardTypeOptions, StyleSheet, Switch, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import React, {useRef} from "react";
import {themeColors} from "@/components/ui/theme-colors";
import {InputFieldTypes} from "@/models/constants";
import {Picker} from "@react-native-picker/picker";

export const InputDecorators = {
    percentage: 'percentage',
    money: 'money'
}
export type InputTypeDropdownOption = {
    id: string,
    name: string
}
type InputFieldProps = {
    title?: string;
    fieldType: string | undefined,
    inputType?: string | null,
    dropdownOptions?: InputTypeDropdownOption[],
    fieldName: string,
    value: any,
    handleChange: (fieldName: string, value: string | number | boolean) => void,
    error?: string;

};

const InputField: React.FC<InputFieldProps> = ({
                                                    title,
                                                    fieldType,
                                                   dropdownOptions,
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

    if (fieldType === 'boolean') {
        let displayValue = false;
        if(typeof value === 'boolean') displayValue = value;
        if(typeof value === 'string' && value) displayValue = Boolean(value);
        return <View style={styles.fieldContainer}>
            {title && title.length > 0 ? <Text style={styles.label}>{title}</Text> : null}
            <View style={styles.switchContainer}>
                <Switch
                    value={displayValue} // Ensure it's a boolean
                    onValueChange={(newValue) => handleChange(fieldName, newValue)}
                />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

    }
    if(fieldType === 'string' && inputType === InputFieldTypes.dropdown){
        return (
            <View style={styles.fieldContainer}>
                {title && title.length > 0 ? <Text style={styles.label}>{title}</Text> : null}
                <View style={[styles.textInputContainer, styles.dropdownContainer]}>
                    <Picker
                        selectedValue={value}
                        onValueChange={(text) => handleChange(fieldName, text)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem} // Added for iOS
                    >
                        <Picker.Item label="Select County / Parish" value={null} />
                        {dropdownOptions && dropdownOptions.length > 0 && dropdownOptions.map((option) => (
                            <Picker.Item key={option.id} label={option.name} value={option.id} />
                        ))}
                    </Picker>
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        );
    }
    if(fieldType === 'string'){


        return <TouchableWithoutFeedback
            onPress={() => inputRef.current?.focus()} // Focus input when tapped
        >
            <View style={styles.fieldContainer}>
                {title && title.length > 0 ? <Text style={styles.label}>{title}</Text> : null}
                <View style={styles.textInputContainer}>
                    <TextInput
                        ref={inputRef}
                        keyboardType={keyboardType}
                        style={styles.input}
                        value={String(value)}
                        onChangeText={(text) => handleChange(fieldName, text)}
                    />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </TouchableWithoutFeedback>
    }
    if(fieldType === 'number'){
        if(keyboardType === 'default'){
            keyboardType = 'decimal-pad';
        }

        return <TouchableWithoutFeedback
            onPress={() => inputRef.current?.focus()} // Focus input when tapped
        >
            <View style={styles.fieldContainer}>
                {title && title.length > 0 ? <Text style={styles.label}>{title}</Text> : null}
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
                            // Validate intermediate input as numeric, including incomplete decimals
                            if (/^(\d+(\.\d*)?|\.\d*)?$/.test(text)) {
                                // Update state as string temporarily
                                handleChange(fieldName, text);
                            }
                        }}
                        onBlur={() => {
                            const currentValue = value;
                            if (typeof currentValue === 'string') {
                                const numericValue = parseFloat(currentValue);
                                handleChange(fieldName, isNaN(numericValue) ? 0 : numericValue); // Finalize as number
                            }
                        }}
                    />
                    {inputType && InputDecorators.percentage === inputType &&
                        <View style={styles.percentContainer}>
                            <Text style={styles.percentText}>%</Text>
                        </View>
                    }
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </TouchableWithoutFeedback>
    }


    return null;

}

const styles = StyleSheet.create({
    fieldContainer: {
        margin: 4,
        marginVertical: 6
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        marginTop: 4
    },
    input: {
        flex: 1,
        marginBottom: 0,
        paddingVertical: 4, // Ensures consistent vertical spacing
        paddingHorizontal: 8, // Padding for left and right
        minHeight: 25, // Ensures a visible height
        fontSize: 14, // Readable text size
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    },
    error: {
        color: themeColors.dangerActive,
        marginTop: 4, // Add spacing above error text
        fontSize: 12,
    },
    percentContainer: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
    },
    percentText: {
        color: '#666',
        fontSize: 16,
    },
    dropdownContainer: {
        justifyContent: 'center',
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },

    picker: {
        flex: 1,
        marginTop: -13,
        height: 65, // Increased height
        marginHorizontal: 2,
        fontSize: 14
    },

    pickerItem: {
        height: 45, // Match picker height
        fontSize: 14, // Match input text size
    }
});

export default InputField;