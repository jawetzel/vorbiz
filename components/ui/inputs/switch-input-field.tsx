import {StyleSheet, Switch, Text, View} from "react-native";
import React from "react";
import InputError from "@/components/ui/inputs/input-error";
import {CommonInputStyles, InputFieldProps} from "@/components/ui/input-field";

const SwitchInputField: React.FC<InputFieldProps> = ({
                                                    title,
                                                    fieldName,
                                                    value,
                                                    handleChange,
                                                   error
                                                }) => {
    let displayValue = false;
    if(typeof value === 'boolean') displayValue = value;
    if(typeof value === 'string' && value) displayValue = Boolean(value);
    return <View style={CommonInputStyles.fieldContainer}>
        {title && title.length > 0 ? <Text style={CommonInputStyles.label}>{title}</Text> : null}
        <View style={styles.switchContainer}>
            <Switch
                value={displayValue} // Ensure it's a boolean
                onValueChange={(newValue) => handleChange(fieldName, newValue)}
            />
        </View>
        <InputError error={error} />
    </View>

}

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    }
});

export default SwitchInputField;