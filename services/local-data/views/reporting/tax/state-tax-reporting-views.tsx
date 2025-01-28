import _ from "lodash";
import {SaleLineViewModel} from "@/services/local-data/models/sale-line-model";

export interface stateSalesTaxViewModel {
    locationName: string,
    taxExemptSales: number,
    taxExempt501c3Sales: number,
    taxExemptResale: number,
    sales: number,
    stateTax: number,
    totalAmount: number,
}

export const taxBreakdownByState = async  (
    saleLines: SaleLineViewModel[]
): Promise<stateSalesTaxViewModel[]> => {
    const groupedSales = _.groupBy(saleLines, line =>
        line.location.state
    );

    const aggregatedData = Object.values(groupedSales).map(group => {
        const location = group[0].location.state;
        const initial: stateSalesTaxViewModel = {
            locationName: location,
            taxExemptSales: 0,
            taxExempt501c3Sales: 0,
            taxExemptResale: 0,
            sales: 0,
            stateTax: 0,
            totalAmount: 0
        };
        return group.reduce((acc, curr) => ({
            locationName: acc.locationName,
            // todo this is a perfect example of something that needs unit tests so no one in the future messes up
            // tax exempt resale takes precedent over 501c3
            taxExemptSales: acc.taxExemptSales + ((curr.sale.taxExemptForCharity || curr.sale.taxExemptForResale) ? curr.line.subtotal : 0),
            taxExempt501c3Sales: acc.taxExempt501c3Sales + ((curr.sale.taxExemptForCharity && !curr.sale.taxExemptForResale) ? curr.line.subtotal : 0),
            taxExemptResale: acc.taxExemptResale + (curr.sale.taxExemptForResale ? curr.line.subtotal : 0),
            sales: acc.sales + curr.line.subtotal,
            stateTax: acc.stateTax + curr.line.stateTaxAmount,
            totalAmount: acc.totalAmount + curr.line.total
        }), initial);
    });

    return _.orderBy(aggregatedData, ['locationName']);
};