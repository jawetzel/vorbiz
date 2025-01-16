import {Database, Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class ProductModel extends Model {
    static table = 'products';

    static columns =  [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'price', type: 'number' },
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
        { name: 'upc', type: 'string' },
        { name: 'asin', type: 'string' },
        { name: 'certifications', type: 'string' },
        { name: 'dimensionH', type: 'number'},
        { name: 'dimensionW', type: 'number'},
        { name: 'dimensionD', type: 'number' },
        { name: 'shippingDimensionH', type: 'number' },
        { name: 'shippingDimensionW', type: 'number'},
        { name: 'shippingDimensionD', type: 'number' },
        { name: 'dimensionUnitOfMeasurement', type: 'string' },
        { name: 'weightLbs', type: 'number' },
        { name: 'shippingWeightLbs', type: 'number'},
    ];
    static associations: Record<string, { type: 'has_many'; foreignKey: string }>  = {
        saleLines: { type: 'has_many', foreignKey: 'product_id' },
        productVariants: { type: 'has_many', foreignKey: 'product_id' },
    }

    static GetColumnType(column: string){
        const columnDef = ProductModel.columns.find((col) => col.name === column);
        return columnDef?.type;
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

    // Default numeric fields to 0
    @field('price') price!: number | null;

    static validate(productData: any) {
        const errors: Record<string, string> = {};

        // Validate name if provided
        if (productData.name && productData.name.length < 1) {
            errors.name = 'Name cannot be empty.';
        }

        // Validate description if provided
        if (productData.description && productData.description.length < 1) {
            errors.description = 'Description cannot be empty.';
        }

        // Validate category if provided
        if (productData.category && productData.category.length < 1) {
            errors.category = 'Category cannot be empty.';
        }

        // Validate SKU if provided
        if (productData.sku && productData.sku.length < 1) {
            errors.sku = 'SKU cannot be empty.';
        }

        // Validate brand if provided
        if (productData.brand && productData.brand.length < 1) {
            errors.brand = 'Brand cannot be empty.';
        }

        // Validate price if provided (must be greater than 0)
        if (productData.price !== null && (isNaN(productData.price) || productData.price < 0)) {
            errors.price = 'Price must be a valid number greater than 0.';
        }

        // Validate image if provided
        if (productData.image && productData.image.length < 1) {
            errors.image = 'Image cannot be empty.';
        }

        // Validate tags if provided
        if (productData.tags && productData.tags.length < 1) {
            errors.tags = 'Tags cannot be empty.';
        }

        // Validate SEO Terms if provided
        if (productData.seoTerms && productData.seoTerms.length < 1) {
            errors.seoTerms = 'SEO Terms cannot be empty.';
        }

        // Validate SEO Description if provided
        if (productData.seoDescription && productData.seoDescription.length < 1) {
            errors.seoDescription = 'SEO Description cannot be empty.';
        }

        // Validate UPC if provided
        if (productData.upc && productData.upc.length < 1) {
            errors.upc = 'UPC cannot be empty.';
        }

        // Validate ASIN if provided
        if (productData.asin && productData.asin.length < 1) {
            errors.asin = 'ASIN cannot be empty.';
        }
        // Validate certifications if provided
        if (productData.certifications && productData.certifications.length < 1) {
            errors.certifications = 'Certifications cannot be empty.';
        }

        // Validate boolean personalization options
        if (productData.canPersonalizeCustomText !== undefined && typeof productData.canPersonalizeCustomText !== 'boolean') {
            errors.canPersonalizeCustomText = 'Personalization option "Custom Text" must be a boolean.';
        }

        if (productData.canPersonalizeCustomImage !== undefined && typeof productData.canPersonalizeCustomImage !== 'boolean') {
            errors.canPersonalizeCustomImage = 'Personalization option "Custom Image" must be a boolean.';
        }

        if (productData.canPersonalizeSize !== undefined && typeof productData.canPersonalizeSize !== 'boolean') {
            errors.canPersonalizeSize = 'Personalization option "Size" must be a boolean.';
        }

        if (productData.canPersonalizeCustomMessage !== undefined && typeof productData.canPersonalizeCustomMessage !== 'boolean') {
            errors.canPersonalizeCustomMessage = 'Personalization option "Custom Message" must be a boolean.';
        }

        if (productData.canPersonalizeGiftwrap !== undefined && typeof productData.canPersonalizeGiftwrap !== 'boolean') {
            errors.canPersonalizeGiftwrap = 'Personalization option "Giftwrap" must be a boolean.';
        }


        return errors;
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
