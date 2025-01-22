import { StyleSheet, Text, View} from "react-native";
import React from "react";
import {Picker} from "@react-native-picker/picker";
import InputError from "@/components/ui/inputs/input-error";
import {InputFieldProps} from "@/components/ui/inputs/input-typings";
import {CommonInputStyles} from "@/components/ui/inputs/input-styles";


const DropdownInputField: React.FC<InputFieldProps> = ({
                                                    title,
                                                   dropdownOptions,
                                                    fieldName,
                                                    value,
                                                    handleChange,
                                                   error
                                                }) => {
    return (
        <View style={CommonInputStyles.fieldContainer}>
            {title && title.length > 0 ? <Text style={CommonInputStyles.label}>{title}</Text> : null}
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
            <InputError error={error} />
        </View>
    );
}

const styles = StyleSheet.create({

    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    },

    dropdownContainer: {
        justifyContent: 'center',
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },
    picker: {
        flex: 1,
        marginTop: -13,
        height: 65,
        marginHorizontal: 2,
        fontSize: 14
    },
    pickerItem: {
        height: 45,
        fontSize: 14,
    }
});

export default DropdownInputField;