import {Database, Model} from "@nozbe/watermelondb";
import {field} from "@nozbe/watermelondb/decorators";
import {Associations} from "@nozbe/watermelondb/Model";

type modelT = SaleLineModel;

export default class SaleLineModel extends Model {
    static table = 'saleLines';
    static columns = [
        { name: 'sale_id', type: 'string', isIndexed: true }, // Relation to `sales`
        { name: 'product_id', type: 'string', isIndexed: true }, // Relation to `products`
        { name: 'productVariant_id', type: 'string', isIndexed: true }, // Relation to `products`
        { name: 'qty', type: 'number' },
        { name: 'subtotal', type: 'number' },
        { name: 'countyParishTaxAmount', type: 'number' },
        { name: 'stateTaxAmount', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'total', type: 'number' },
        {name: 'price', type: 'number' },
        { name: 'refundAmount', type: 'number' },
        { name: 'qtyRefunded', type: 'number' },
    ];
    static associations: Associations  = {
        sales: { type: 'belongs_to', key: 'sale_id' },
        products: { type: 'belongs_to', key: 'product_id' },
        productVariants: { type: 'belongs_to', key: 'productVariant_id' },
    }
    static GetColumnType(column: string){
        const columnDef = SaleLineModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }

    @field('sale_id') sale_id!: string | null;
    @field('product_id') product_id!: string | null;
    @field('productVariant_id') productVariant_id!: string | null;

    @field('qty') qty!: number;
    @field('subtotal') subtotal!: number;
    @field('countyParishTaxAmount') countyParishTaxAmount!: number;
    @field('stateTaxAmount') stateTaxAmount!: number;
    @field('discount') discount!: number;
    @field('total') total!: number;
    @field('price') price!: number;
    @field('refundAmount') refundAmount!: number;
    @field('qtyRefunded') qtyRefunded!: number;



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