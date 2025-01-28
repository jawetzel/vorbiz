import {Database, Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';
import {Associations} from "@nozbe/watermelondb/Model";
import {InputFieldTypes} from "@/models/constants";
import {ValidateProduct} from "@/utils/validation/model-validators/product-validators";

export default class ProductModel extends Model {
    static table = 'products';

    static columns =  [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'price', type: 'number', inputType: InputFieldTypes.money },
        { name: 'sku', type: 'string' },
        { name: 'brand', type: 'string' },
        { name: 'image', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'seoTerms', type: 'string' },
        { name: 'seoDescription', type: 'string' },
        { name: 'canPersonalizeCustomText', type: 'boolean' },
        { name: 'canPersonalizeCustomImage', type: 'boolean' },
        { name: 'canPersonalizeSize', type: 'boolean' },
        { name: 'canPersonalizeCustomMessage', type: 'boolean' },
        { name: 'canPersonalizeGiftwrap', type: 'boolean' },
        { name: 'upc', type: 'string', inputType: InputFieldTypes.numeric },
        { name: 'asin', type: 'string' },
        { name: 'certifications', type: 'string' },
        { name: 'dimensionH', type: 'number', inputType: InputFieldTypes.decimal},
        { name: 'dimensionW', type: 'number', inputType: InputFieldTypes.decimal},
        { name: 'dimensionD', type: 'number', inputType: InputFieldTypes.decimal },
        { name: 'shippingDimensionH', type: 'number', inputType: InputFieldTypes.decimal },
        { name: 'shippingDimensionW', type: 'number', inputType: InputFieldTypes.decimal},
        { name: 'shippingDimensionD', type: 'number', inputType: InputFieldTypes.decimal},
        { name: 'dimensionUnitOfMeasurement', type: 'string' },
        { name: 'weightLbs', type: 'number',  inputType: InputFieldTypes.decimal},
        { name: 'shippingWeightLbs', type: 'number', inputType: InputFieldTypes.decimal},
        {name: 'isActive', type: 'boolean' },
        {name: 'quickButton', type: 'boolean' },
        {name: 'isTaxIncludedPrice', type: 'boolean' },
    ];
    static associations: Associations  = {
        saleLines: { type: 'has_many', foreignKey: 'product_id' },
        productVariants: { type: 'has_many', foreignKey: 'product_id' },
    }

    static GetColumnType(column: string){
        const columnDef = ProductModel.columns.find((col) => col.name === column);
        return columnDef?.type;
    }
    static GetInputType(column: string){
        const columnDef = ProductModel.columns.find((col) => col.name === column);
        return columnDef?.inputType ?? null;
    }


    // Default string fields to empty string ""
    @text('name') name!: string | null;
    @text('description') description!: string | null;
    @text('category') category!: string | null;
    @text('sku') sku!: string | null;
    @text('brand') brand!: string | null;
    @text('image') image!: string | null;
    @text('tags') tags!: string | null;
    @text('seoTerms') seoTerms!: string | null;
    @text('seoDescription') seoDescription!: string | null;
    @text('upc') upc!: string | null;
    @text('asin') asin!: string | null;
    @text('certifications') certifications!: string | null;
    @field('dimensionH') dimensionH!: number | null;
    @field('dimensionW') dimensionW!: number | null;
    @field('dimensionD') dimensionD!: number | null;
    @field('shippingDimensionH') shippingDimensionH!: number | null;
    @field('shippingDimensionW') shippingDimensionW!: number | null;
    @field('shippingDimensionD') shippingDimensionD!: number | null;
    @text('dimensionUnitOfMeasurement') dimensionUnitOfMeasurement!: string | null;
    @field('weightLbs') weightLbs!: number | null;
    @field('shippingWeightLbs') shippingWeightLbs!: number | null;

    // Default boolean fields to false
    @field('canPersonalizeCustomText') canPersonalizeCustomText!: boolean;
    @field('canPersonalizeCustomImage') canPersonalizeCustomImage!: boolean;
    @field('canPersonalizeSize') canPersonalizeSize!: boolean;
    @field('canPersonalizeCustomMessage') canPersonalizeCustomMessage!: boolean;
    @field('canPersonalizeGiftwrap') canPersonalizeGiftwrap!: boolean;
    @field('isActive') isActive!: boolean;
    @field('quickButton') quickButton!: boolean;
    @field('isTaxIncludedPrice') isTaxIncludedPrice!: boolean;
    // Default numeric fields to 0
    @field('price') price!: number | null;

    static validate(productData: any) {
        return ValidateProduct(productData);
    }


        // Static method to load
    static async load(database: Database): Promise<ProductModel[]> {
        const data = await database.collections.get(this.table).query().fetch();

        // Cast the result to LocationModel[] explicitly
        return data as ProductModel[];
    }

    // Static method to load location by ID
    static async loadById(database: Database, id: string): Promise<ProductModel> {
        return await database.collections.get(this.table).find(id) as ProductModel;
    }

    // Static method to create a new location
    static async create(database: Database, data: ProductModel): Promise<ProductModel> {
        return await database.write(async () => {
            return database.collections.get(this.table).create((record) => {
                Object.assign(record, data);
            });
        }) as ProductModel;
    }

    static async update(database: Database, id: string, data: Partial<ProductModel>): Promise<boolean> {
        await database.write(async () => {
            const existing = await database.collections.get(this.table).find(id);

            await existing.update((record) => {
                // Explicitly update each field that exists in the record
                for (const [key, value] of Object.entries(data)) {
                    if (key in record) {
                        (record as any)[key] = value; // Dynamically set field values
                    }
                }
            });
        });
        return true;
    }

    static async deleteById(database: any, id: string) {
        await database.write(async () => {
            const data = await database.collections.get(this.table).find(id);
            await data.destroyPermanently();
        })

    }
}
