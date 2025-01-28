import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import {mySchema} from './schema'
import LocationModel from "@/services/local-data/models/location-model";
import ProductModel from "@/services/local-data/models/product-model";
import SaleLineModel from "@/services/local-data/models/sale-line-model";
import SaleModel from "@/services/local-data/models/sale-model";
import ProductVariantModel from "@/services/local-data/models/product-variant-model";
import CustomerModel from "@/services/local-data/models/customer-model";


// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema: mySchema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    //migrations,
    dbName: 'vorbizdb',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    jsi: true, /* Platform.OS === 'ios' */
    // (optional, but you should implement this method)
    onSetUpError: error => {
        console.error('Database setup failed:', error);
    },
})

// Then, make a Watermelon database from it!
const database = new Database({
    adapter,
    modelClasses: [
        LocationModel,
        ProductModel,
        ProductVariantModel,
        SaleLineModel,
        SaleModel,
        CustomerModel
    ],
})
export default database;