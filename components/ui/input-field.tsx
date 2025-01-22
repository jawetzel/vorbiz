import {StyleSheet} from "react-native";
import React from "react";
import {InputFieldTypes} from "@/models/constants";
import DropdownInputField from "@/components/ui/inputs/dropdown-input-field";
import SwitchInputField from "@/components/ui/inputs/switch-input-field";
import TextInputField from "@/components/ui/inputs/text-input-field";
import NumberInputField from "@/components/ui/inputs/number-input-field";
import {themeColors} from "@/components/ui/theme-colors";

export const InputDecorators = {
    percentage: 'percentage',
    money: 'money'
}
export type InputTypeDropdownOption = {
    id: string,
    name: string
}
export type InputFieldProps = {
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

    if(fieldType === 'boolean') {
        return <SwitchInputField
            title={title}
            fieldType={fieldType}
            dropdownOptions={dropdownOptions}
            inputType={inputType}
            fieldName={fieldName}
            value={value}
            handleChange={handleChange}
            error={error}
        />
    }
    if(fieldType === 'string' && inputType === InputFieldTypes.dropdown){
        return <DropdownInputField
            title={title}
            fieldType={fieldType}
            dropdownOptions={dropdownOptions}
            inputType={inputType}
            fieldName={fieldName}
            value={value}
            handleChange={handleChange}
            error={error}
        />
    }
    if(fieldType === 'string'){
        return <TextInputField
            title={title}
            fieldType={fieldType}
            dropdownOptions={dropdownOptions}
            inputType={inputType}
            fieldName={fieldName}
            value={value}
            handleChange={handleChange}
            error={error}
        />
    }
    if(fieldType === 'number'){
        return <NumberInputField
            title={title}
            fieldType={fieldType}
            dropdownOptions={dropdownOptions}
            inputType={inputType}
            fieldName={fieldName}
            value={value}
            handleChange={handleChange}
            error={error}
        />
    }

    return null;

}

export const CommonInputStyles = StyleSheet.create({
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
    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    },
});

export default InputField;