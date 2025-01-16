import { Model } from '@nozbe/watermelondb';
import {date, field} from '@nozbe/watermelondb/decorators';

export default class SaleModel extends Model {
    static table = 'sales';
    static columns = [
        { name: 'location_id', type: 'string', isIndexed: true }, // Relation to `locations`
        { name: 'stateTaxRate', type: 'number' },
        { name: 'countyParishTaxRate', type: 'number' },
        { name: 'refundAmount', type: 'number' },
        { name: 'saleDate', type: 'number' }, // `@date` fields are stored as timestamps
    ];
    static associations: Record<string, { type: 'has_many'; foreignKey: string }> = {
        saleLines: { type: 'has_many', foreignKey: 'sale_id' },
    };
    static GetColumnType(column: string){
        const columnDef = SaleModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }

    @field('location_id') location_id!: string | null;

    @field('stateTaxRate') stateTaxRate!: number;
    @field('countyParishTaxRate') countyParishTaxRate!: number;
    @field('refundAmount') refundAmount!: number;
    @date('saleDate') saleDate!: Date;
}