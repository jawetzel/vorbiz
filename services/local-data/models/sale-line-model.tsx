import {Model} from "@nozbe/watermelondb";
import {field} from "@nozbe/watermelondb/decorators";

export default class SaleLineModel extends Model {
    static table = 'saleLines';
    static columns = [
        { name: 'sale_id', type: 'string', isIndexed: true }, // Relation to `sales`
        { name: 'product_id', type: 'string', isIndexed: true }, // Relation to `products`
        { name: 'qty', type: 'number' },
        { name: 'subtotal', type: 'number' },
        { name: 'countyParishTaxAmount', type: 'number' },
        { name: 'stateTaxAmount', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'total', type: 'number' },
    ];
    static associations: Record<string, { type: 'belongs_to'; key: string }>  = {
        sales: { type: 'belongs_to', key: 'sale_id' },
        products: { type: 'belongs_to', key: 'product_id' },
    }
    static GetColumnType(column: string){
        const columnDef = SaleLineModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }

    @field('qty') qty!: number;
    @field('subtotal') subtotal!: number;
    @field('countyParishTaxAmount') countyParishTaxAmount!: number;
    @field('stateTaxAmount') stateTaxAmount!: number;
    @field('discount') discount!: number;
    @field('total') total!: number;

}