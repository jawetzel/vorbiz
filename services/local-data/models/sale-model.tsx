import {Database, Model} from '@nozbe/watermelondb';
import {date, field} from '@nozbe/watermelondb/decorators';
import {Associations} from "@nozbe/watermelondb/Model";
import {WriterInterface} from "@nozbe/watermelondb/Database/WorkQueue";


type modelT = SaleModel;

export default class SaleModel extends Model {
    static table = 'sales';
    static columns = [
        { name: 'location_id', type: 'string', isIndexed: true }, // Relation to `locations`
        { name: 'stateTaxRate', type: 'number' },
        { name: 'countyParishTaxRate', type: 'number' },
        { name: 'saleDate', type: 'number' }, // `@date` fields are stored as timestamps
    ];
    static associations: Associations = {
        saleLines: { type: 'has_many', foreignKey: 'sale_id' },
    };
    static GetColumnType(column: string){
        const columnDef = SaleModel.columns.find((col) => col.name === column);
        return columnDef?.type;
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