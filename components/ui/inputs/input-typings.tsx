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

