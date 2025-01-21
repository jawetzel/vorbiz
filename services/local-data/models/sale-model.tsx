import {Database, Model} from '@nozbe/watermelondb';
import {date, field} from '@nozbe/watermelondb/decorators';
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";


type modelT = SaleModel;

export default class SaleModel extends Model {
    static table = 'sales';
    static columns = [
        { name: 'location_id', type: 'string', isIndexed: true }, // Relation to `locations`
        { name: 'stateTaxRate', type: 'number', inputType: InputFieldTypes.percent },
        { name: 'countyParishTaxRate', type: 'number', inputType: InputFieldTypes.percent },
        { name: 'saleDate', type: 'number' }, // `@date` fields are stored as timestamps
    ];
    static associations: Associations = {
        saleLines: { type: 'has_many', foreignKey: 'sale_id' },
    };
    static GetColumnType(column: string){
        const columnDef = SaleModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }
    static GetInputType(column: string){
        const columnDef = SaleModel.columns.find((col) => col.name === column);
        return columnDef?.inputType ?? null;
    }
    @field('location_id') location_id!: string | null;

    @field('stateTaxRate') stateTaxRate!: number;
    @field('countyParishTaxRate') countyParishTaxRate!: number;
    @date('saleDate') saleDate!: number;


    static async createTrans(
        database: Database, // Use only the database instance
        data: Partial<modelT>
    ): Promise<modelT> {
        try {
            const responseData = await database.collections.get(this.table).create((record: Model) => {
                Object.assign(record, data);
            }) as modelT;

            return responseData;
        } catch (error) {
            console.error('Error during create operation:', error);
            throw error;
        }
    }


}