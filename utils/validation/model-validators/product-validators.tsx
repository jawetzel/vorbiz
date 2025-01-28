export const ValidateProduct = (productData: any) => {
    const errors: Record<string, string> = {};

    // Validate name if provided
    if (productData.name && productData.name.length < 1) {
        errors.name = 'Name cannot be empty.';
    }

    // Validate description if provided
    if (productData.description && productData.description.length < 1) {
        errors.description = 'Description cannot be empty.';
    }

    // Validate category if provided
    if (productData.category && productData.category.length < 1) {
        errors.category = 'Category cannot be empty.';
    }

    // Validate SKU if provided
    if (productData.sku && productData.sku.length < 1) {
        errors.sku = 'SKU cannot be empty.';
    }

    // Validate brand if provided
    if (productData.brand && productData.brand.length < 1) {
        errors.brand = 'Brand cannot be empty.';
    }

    // Validate price if provided (must be greater than 0)
    if (productData.price !== null && (isNaN(productData.price) || productData.price < 0)) {
        errors.price = 'Price must be a valid number greater than 0.';
    }

    // Validate image if provided
    if (productData.image && productData.image.length < 1) {
        errors.image = 'Image cannot be empty.';
    }

    // Validate tags if provided
    if (productData.tags && productData.tags.length < 1) {
        errors.tags = 'Tags cannot be empty.';
    }

    // Validate SEO Terms if provided
    if (productData.seoTerms && productData.seoTerms.length < 1) {
        errors.seoTerms = 'SEO Terms cannot be empty.';
    }

    // Validate SEO Description if provided
    if (productData.seoDescription && productData.seoDescription.length < 1) {
        errors.seoDescription = 'SEO Description cannot be empty.';
    }

    // Validate UPC if provided
    if (!productData.upc || productData.upc.length < 1) {
        errors.upc = 'UPC cannot be empty.';
    } else if(productData.upc.length !== 12) {
        errors.upc = 'UPC must be 12 numbers long';
    }


    // Validate ASIN if provided
    if (productData.asin && productData.asin.length < 1) {
        errors.asin = 'ASIN cannot be empty.';
    }
    // Validate certifications if provided
    if (productData.certifications && productData.certifications.length < 1) {
        errors.certifications = 'Certifications cannot be empty.';
    }

    // Validate boolean personalization options
    if (productData.canPersonalizeCustomText !== undefined && typeof productData.canPersonalizeCustomText !== 'boolean') {
        errors.canPersonalizeCustomText = 'Personalization option "Custom Text" must be a boolean.';
    }

    if (productData.canPersonalizeCustomImage !== undefined && typeof productData.canPersonalizeCustomImage !== 'boolean') {
        errors.canPersonalizeCustomImage = 'Personalization option "Custom Image" must be a boolean.';
    }

    if (productData.canPersonalizeSize !== undefined && typeof productData.canPersonalizeSize !== 'boolean') {
        errors.canPersonalizeSize = 'Personalization option "Size" must be a boolean.';
    }

    if (productData.canPersonalizeCustomMessage !== undefined && typeof productData.canPersonalizeCustomMessage !== 'boolean') {
        errors.canPersonalizeCustomMessage = 'Personalization option "Custom Message" must be a boolean.';
    }

    if (productData.canPersonalizeGiftwrap !== undefined && typeof productData.canPersonalizeGiftwrap !== 'boolean') {
        errors.canPersonalizeGiftwrap = 'Personalization option "Giftwrap" must be a boolean.';
    }


    return errors;
}