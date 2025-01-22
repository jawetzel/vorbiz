import React from "react";
import {InputFieldTypes} from "@/models/constants";
import DropdownInputField from "@/components/ui/inputs/input-types/dropdown-input-field";
import SwitchInputField from "@/components/ui/inputs/input-types/switch-input-field";
import TextInputField from "@/components/ui/inputs/input-types/text-input-field";
import NumberInputField from "@/components/ui/inputs/input-types/number-input-field";
import {InputFieldProps} from "@/components/ui/inputs/input-typings";



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


export default InputField;