
export const ValidateLocation = (locationData: any) => {
    const errors: Record<string, string> = {};

    // Validate name if provided
    if (locationData.name && (locationData.name.length < 1 || locationData.name.length > 100)) {
        errors.name = 'Name must be between 1 and 100 characters.';
    }

    // Validate email if provided
    if (locationData.email && !/\S+@\S+\.\S+/.test(locationData.email)) {
        errors.email = 'Invalid email address.';
    }

    if (locationData.phone && !/^(\d{10}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$/.test(locationData.phone)) {
        errors.phone = 'Invalid phone number. Please use a valid format';
    }
    // Validate address if provided (non-empty)
    if (locationData.address && locationData.address.length < 1) {
        errors.address = 'Address cannot be empty.';
    }

    // Validate city if provided (non-empty)
    if (locationData.city && locationData.city.length < 1) {
        errors.city = 'City cannot be empty.';
    }

    // Validate state if provided (non-empty)
    if (!locationData.state || locationData.state.length < 1) {
        errors.state = 'State must be provided. (tax reports)';
    }

    if (!locationData.countyParish || locationData.countyParish.length < 1) {
        errors.state = 'County / Parish must be provided. (tax reports)';
    }

    if (!locationData.localTaxZone || locationData.localTaxZone.length < 1) {
        errors.state = 'Local jurisdiction must be provided. (tax reports)';
    }

    // Validate zip code if provided (5 digits)
    if (locationData.zipCode && !/^\d{5}$/.test(locationData.zipCode)) {
        errors.zipCode = 'Invalid zip code.';
    }

    return errors;
}