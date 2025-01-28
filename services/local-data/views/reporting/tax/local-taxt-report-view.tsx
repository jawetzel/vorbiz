import _ from "lodash";
import {SaleLineViewModel} from "@/services/local-data/models/sale-line-model";

export interface localSalesTaxViewModel {
    state: string,
    countyParish: string,
    jurisdiction: string,
    taxExemptSales: number,
    taxExempt501c3Sales: number,
    taxExemptResale: number,
    sales: number,
    localTax: number,
    totalAmount: number,
}

export const taxBreakdownByJurisdiction = async  (
    saleLines: SaleLineViewModel[]
): Promise<localSalesTaxViewModel[][]> => {
    const groupedSales = _.groupBy(saleLines, line =>
        `${line.location.state}-${line.location.countyParish}-${line.location.localTaxZone}`
    );

    const taxData = Object.values(groupedSales).map(group => {
        const location = group[0].location;
        const initial: localSalesTaxViewModel = {
            state: location.state,
            countyParish: location.countyParish,
            jurisdiction: location.localTaxZone,
            taxExemptSales: 0,
            taxExempt501c3Sales: 0,
            taxExemptResale: 0,
            sales: 0,
            localTax: 0,
            totalAmount: 0
        };
        return group.reduce((acc, curr) => ({
            state: acc.state,
            countyParish: acc.countyParish,
            jurisdiction: acc.jurisdiction,
            // todo this is a perfect example of something that needs unit tests so no one in the future messes up
            // tax exempt resale takes precedent over 501c3
            taxExemptSales: acc.taxExemptSales + ((curr.sale.taxExemptForCharity || curr.sale.taxExemptForResale) ? curr.line.subtotal : 0),
            taxExempt501c3Sales: acc.taxExempt501c3Sales + ((curr.sale.taxExemptForCharity && !curr.sale.taxExemptForResale) ? curr.line.subtotal : 0),
            taxExemptResale: acc.taxExemptResale + (curr.sale.taxExemptForResale ? curr.line.subtotal : 0),
            sales: acc.sales + curr.line.subtotal,
            localTax: acc.localTax + curr.line.localTaxAmount,
            totalAmount: acc.totalAmount + curr.line.total
        }), initial);
    });

    const orderedTaxData = _.orderBy(taxData, ['state', 'countyParish', 'localTaxZone']);

    const groupedByParish = _.groupBy(orderedTaxData, line =>
        `${line.state}-${line.countyParish}`
    );
    const groupGroupsByState = _.groupBy(groupedByParish, line =>
        `${line[0].state}`
    );

    return groupGroupsByState.value
};