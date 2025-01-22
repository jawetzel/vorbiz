import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import LocationModel, {LocationErrors} from "@/services/local-data/models/location-model";
import {ProjectRouteParams} from "@/models/ProjectRouteParams";
import Loader from "@/components/ui/loader";
import InputField, {InputTypeDropdownOption} from "@/components/ui/input-field";
import DeleteButton from "@/components/ui/buttons/delete-button";
import SaveButton from "@/components/ui/buttons/save-button";
import {themeColors} from "@/components/ui/theme-colors";
import { usaStatesWithCounties } from 'typed-usa-states';
import {LoadCountyParishDropdownOptions} from "@/constants/LocationConstants";

export default function LocationDetailScreen() {
    const database = useDatabase();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params: ProjectRouteParams }, 'params'>>();
    const {id} = route.params || {};
    const [dropdownOptions, setDropdownOptions] =
        useState<Record<string, InputTypeDropdownOption[]>>({
            'state': usaStatesWithCounties.map(state => {
                return {
                    id: state.abbreviation,
                    name: state.abbreviation
                } as InputTypeDropdownOption
            }),
            'countyParish': [],
        });
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<LocationModel>({
        name: '',
        address: '',
        city: '',
        state: '',
        countyParish: '',
        zipCode: '',
        countyParishTaxZone: '',
        countyParishTaxRate: 0.0,
        stateTaxRate: 0.0,
        phone: '',
        email: '',
        contactName: '',
    } as LocationModel);

    const [errors, setErrors] =
        useState<{ [key: string]: string }>({
            name: '',
            price: '',
        });

    useEffect(() => {
        const loadLocation = async () => {
            if (id) {
                try {
                    const fetchedLocation = await LocationModel.loadById(database, id);
                    if (fetchedLocation) {
                        setLocation({
                            name: fetchedLocation.name || '',
                            address: fetchedLocation.address || '',
                            city: fetchedLocation.city || '',
                            state: fetchedLocation.state || '',
                            zipCode: fetchedLocation.zipCode || '',
                            countyParish: fetchedLocation.countyParish || '',
                            countyParishTaxZone: fetchedLocation.countyParishTaxZone || '',
                            countyParishTaxRate: fetchedLocation.countyParishTaxRate || 0.0,
                            stateTaxRate: fetchedLocation.stateTaxRate || 0.0,
                            phone: fetchedLocation.phone || '',
                            email: fetchedLocation.email || '',
                            contactName: fetchedLocation.contactName || '',
                        } as LocationModel);
                    }
                    setDropdownOptions(prevState => ({
                        ...prevState,
                        ['countyParish']: LoadCountyParishDropdownOptions(fetchedLocation.state),
                    }));
                } catch (error) {
                    console.error('Error loading location:', error);
                    Alert.alert('Error', 'Unable to load location.');
                }
            }
            setLoading(false);
        };

        loadLocation();
    }, [id, database]);

    const handleSave = async () => {
        const validationErrors = LocationModel.validate(location);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set validation errors to be displayed
            return;
        }

        setLoading(true);
        try {
            if (id) {
                // Update existing location using LocationModel
                await LocationModel.update(database, id, location);
            } else {
                // Create a new location using LocationModel
                await LocationModel.create(database, location);
            }

            Alert.alert('Success', `Location ${id ? 'updated' : 'created'} successfully.`);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving location:', error);
            Alert.alert('Error', `Failed to ${id ? 'update' : 'create'} location.`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string | boolean | number) => {
        const typing = LocationModel.GetColumnType(field);
        let parsedValue = null;
        if (typeof value === 'boolean') {
            parsedValue = value;
        } else if (typeof value === 'number') {
            parsedValue = value;
        } else {
            if (typing === 'number') {
                if (/^(\d+(\.\d*)?|\.\d*)?$/.test(value)) {
                    parsedValue = value;
                }
            } else if (typing === 'boolean') {
                parsedValue = Boolean(value);
            } else {
                parsedValue = value;
            }
        }

        setLocation((prev) => ({
            ...prev,
            [field]: parsedValue,
        } as LocationModel));
        if(field === 'state' && (value === null || typeof value === 'string')){
            setDropdownOptions(prevState => ({
                ...prevState,
                ['countyParish']: LoadCountyParishDropdownOptions(value),
            }));
        }
    };

    const handleDelete = () => {
        if (!id) return;

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this location? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Delete canceled'),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await LocationModel.deleteById(database, id);
                            Alert.alert('Success', 'Location deleted successfully.');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting location:', error);
                            Alert.alert('Error', 'Failed to delete location.');
                        }
                    },
                },
            ],
            {cancelable: false}
        );
    };

    if (loading) {
        return (
            <Loader/>
        );
    }
    const fieldDisplayNames: Record<string, string> = {
        name: 'Location Name',
        contactName: 'Contact Name',
        phone: 'Phone Number',
        email: 'Email Address',
        state: 'State',
        countyParish: 'County/Parish',
        countyParishTaxZone: 'County/Parish Tax Zone',
        countyParishTaxRate: 'County/Parish Tax Rate',
        stateTaxRate: 'State Tax Rate',
        address: 'Street Address',
        city: 'City',
        zipCode: 'ZIP Code'

    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.group}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.groupTitle}>
                        Location Details
                    </Text>
                </View>
                {[
                    'name',
                    'contactName',
                    'phone', 'email',
                    'state', 'countyParish',
                    'countyParishTaxZone', 'countyParishTaxRate', 'stateTaxRate',
                    'address', 'city', 'zipCode'
                ].map((field) => {
                    return <View key={'locations_' + field} style={styles.sectionContent}>
                        <InputField
                            title={fieldDisplayNames[field]}
                            fieldType={LocationModel.GetColumnType(field)}
                            inputType={LocationModel.GetInputType(field)}
                            dropdownOptions={dropdownOptions[field]}
                            fieldName={field}
                            value={location[field as keyof LocationErrors]}
                            handleChange={handleChange}
                            error={errors[field]}
                        />
                    </View>
                })}
            </View>

            <DeleteButton handle={handleDelete} />
            <View style={styles.buttonSpacing} />
            <SaveButton handle={handleSave} text={id ? 'Save' : 'Create'} />
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: themeColors.background,
    },
    buttonSpacing: {
        height: 16,
    },
    group: {
        marginBottom: 24,
        borderWidth: 1,
        borderColor: themeColors.borders,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: themeColors.backgroundTwo,
    },
    sectionHeader: {
        padding: 12,
        backgroundColor: themeColors.backgroundTwo,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders,
    },
    groupTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: themeColors.text,
    },
    sectionContent: {
        paddingHorizontal: 12,
        backgroundColor: themeColors.backgroundThree,
    },
});