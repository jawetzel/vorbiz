import { Model, Database } from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";

export default class LocationModel extends Model {
    static table = 'locations';

    static columns = [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string', inputType: InputFieldTypes.dropdown },
        { name: 'countyParish', type: 'string', inputType: InputFieldTypes.dropdown},
        { name: 'zipCode', type: 'string', inputType: InputFieldTypes.numeric },
        { name: 'countyParishTaxZone', type: 'string' },
        { name: 'countyParishTaxRate', type: 'number', inputType: InputFieldTypes.percent},
        { name: 'stateTaxRate', type: 'number', inputType: InputFieldTypes.percent },
        { name: 'phone', type: 'string', inputType: InputFieldTypes.phone },
        { name: 'email', type: 'string', inputType: InputFieldTypes.email},
        { name: 'contactName', type: 'string' },
    ];
    static associations: Associations  = {
        sales: { type: 'has_many', foreignKey: 'sale_id' },
    }
    static GetColumnType(column: string){
        const columnDef = LocationModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }
    static GetInputType(column: string){
        const columnDef = LocationModel.columns.find((col) => col.name === column);
        return columnDef?.inputType ?? null;
    }

    @text('name') name!: string;
    @text('address') address!: string;
    @text('city') city!: string;
    @text('state') state!: string;
    @text('countyParish') countyParish!: string;
    @text('zipCode') zipCode!: string;
    @text('countyParishTaxZone') countyParishTaxZone!: string;
    @field('countyParishTaxRate') countyParishTaxRate!: number;
    @field('stateTaxRate') stateTaxRate!: number;
    @text('phone') phone!: string;
    @text('email') email!: string;
    @text('contactName') contactName!: string;


    static validate(locationData: any) {
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
        if (locationData.state && locationData.state.length < 1) {
            errors.state = 'State cannot be empty.';
        }

        // Validate zip code if provided (5 digits)
        if (locationData.zipCode && !/^\d{5}$/.test(locationData.zipCode)) {
            errors.zipCode = 'Invalid zip code.';
        }

        return errors;
    }

    // Static method to load
    static async load(database: Database): Promise<LocationModel[]> {
        const locations = await database.collections.get(this.table).query().fetch();

        // Cast the result to LocationModel[] explicitly
        return locations as LocationModel[];
    }

    // Static method to load location by ID
    static async loadById(database: Database, id: string): Promise<LocationModel> {
        return await database.collections.get(this.table).find(id) as LocationModel;
    }

    // Static method to create a new location
    static async create(database: Database, locationData: LocationModel): Promise<LocationModel> {
        return await database.write(async () => {
            return await database.collections.get(this.table).create((record) => {
                Object.assign(record, locationData);
            });
        }) as LocationModel;
    }

    // Static method to update an existing location
    static async update(database: Database, id: string, locationData: LocationModel): Promise<boolean> {
        await database.write(async () => {
            const existingLocation = await database.collections.get(this.table).find(id);
            await existingLocation.update((record) => {
                Object.assign(record, locationData);
            });
        });
        return true;
    }

    static async deleteById(database: any, id: string) {
        await database.write(async () => {
            const location = await database.collections.get(this.table).find(id);
            await location.destroyPermanently();
        })

    }
}

export interface LocationErrors {
    name?: string;
    email?: string;
    phone?: string;
    zipCode?: string;
    countyParishTaxRate?: string;
    stateTaxRate?: string;
}