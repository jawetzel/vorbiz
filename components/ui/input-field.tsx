import {StyleSheet, Switch, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import React, {useRef} from "react";
import {themeColors} from "@/components/ui/theme-colors";

type InputFieldProps = {
    title?: string;
    fieldType: string | undefined,
    fieldName: string,
    value: any,
    handleChange: (fieldName: string, value: string | number | boolean) => void,
    error?: string;

};

const InputField: React.FC<InputFieldProps> = ({
                                                    title,
                                                    fieldType,
                                                    fieldName,
                                                    value,
                                                    handleChange,
                                                   error
                                                }) => {
    const inputRef = useRef<TextInput | null>(null); // Reference to the input


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

    if(fieldType === 'string'){
        return <TouchableWithoutFeedback
            onPress={() => inputRef.current?.focus()} // Focus input when tapped
        >
            <View style={styles.fieldContainer}>
                {title && title.length > 0 ? <Text style={styles.label}>{title}</Text> : null}
                <View style={styles.textInputContainer}>
                    <TextInput
                        ref={inputRef}
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
        return <TouchableWithoutFeedback
            onPress={() => inputRef.current?.focus()} // Focus input when tapped
        >
            <View style={styles.fieldContainer}>
                {title && title.length > 0 ? <Text style={styles.label}>{title}</Text> : null}
                <View style={styles.textInputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={String(value)}
                        keyboardType="numeric"
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
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        </TouchableWithoutFeedback>
    }

    return null;

}

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        marginTop: 4
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 6,
        paddingVertical: 4, // Ensures consistent vertical spacing
        paddingHorizontal: 8, // Padding for left and right
        borderBottomColor: themeColors.borders,
        minHeight: 25, // Ensures a visible height
        fontSize: 14, // Readable text size
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    textInputContainer: {
        marginBottom: 4,
    },
    error: {
        color: themeColors.dangerActive,
        marginTop: 4, // Add spacing above error text
        fontSize: 12,
    },

});

export default InputField;