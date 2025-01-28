import { Model, Database } from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";
import {ValidateCustomer} from "@/utils/validation/model-validators/customer-validators";

export default class CustomerModel extends Model {
    static table = 'customers';

    static columns = [
        { name: 'name', type: 'string' },
        { name: 'resaleCertId', type: 'string' },
        { name: 'ein', type: 'string' },
        { name: 'charity501c3ein', type: 'string', inputType: InputFieldTypes.numeric },
        { name: 'address', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string', inputType: InputFieldTypes.dropdown },
        { name: 'zipCode', type: 'string', inputType: InputFieldTypes.numeric },
        { name: 'phone', type: 'string', inputType: InputFieldTypes.phone },
        { name: 'email', type: 'string', inputType: InputFieldTypes.email},
        { name: 'contactName', type: 'string' },
    ];
    static associations: Associations  = {
        sales: { type: 'has_many', foreignKey: 'sale_id' },
    }
    static GetColumnType(column: string){
        const columnDef = CustomerModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }
    static GetInputType(column: string){
        const columnDef = CustomerModel.columns.find((col) => col.name === column);
        return columnDef?.inputType ?? null;
    }

    @text('name') name!: string;
    @text('resaleCertId') resaleCertId!: string | null;
    @text('charity501c3ein') ein!: string;
    @text('address') address!: string;
    @text('city') city!: string;
    @text('state') state!: string;
    @text('zipCode') zipCode!: string;
    @text('phone') phone!: string;
    @text('email') email!: string;
    @text('contactName') contactName!: string;


    static validate(customerData: any) {
        return ValidateCustomer(customerData);
    }

    // Static method to load
    static async load(database: Database): Promise<CustomerModel[]> {
        const locations = await database.collections.get(this.table).query().fetch();

        // Cast the result to LocationModel[] explicitly
        return locations as CustomerModel[];
    }

    // Static method to load location by ID
    static async loadById(database: Database, id: string): Promise<CustomerModel> {
        return await database.collections.get(this.table).find(id) as CustomerModel;
    }

    // Static method to create a new location
    static async create(database: Database, locationData: CustomerModel): Promise<CustomerModel> {
        return await database.write(async () => {
            return await database.collections.get(this.table).create((record) => {
                Object.assign(record, locationData);
            });
        }) as CustomerModel;
    }

    // Static method to update an existing location
    static async update(database: Database, id: string, locationData: CustomerModel): Promise<boolean> {
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

export interface CustomerErrors {
    name?: string;
}