
export const  ValidateProductVariant = (variantData: any) => {
    const errors: Record<string, string> = {};

    if (!variantData.upc || variantData.upc.length < 1) {
        errors.upc = 'UPC cannot be empty.';
    } else if(variantData.upc.length !== 12) {
        errors.upc = 'UPC must be 12 numbers long';
    }

    return errors;
}