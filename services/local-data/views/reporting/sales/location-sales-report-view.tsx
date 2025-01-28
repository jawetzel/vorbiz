import LocationModel from "@/services/local-data/models/location-model";
import _ from "lodash";
import {AggregatedSaleLine} from "@/services/local-data/models/sale-line-model";

export interface LocationGroupedAggregatedSaleLineModel {
    locationName: string,
    location: LocationModel,
    aggregatedSales: AggregatedSaleLine[]
}

export const groupAggregatedSalesByLocation = async  (
    aggregatedSales: AggregatedSaleLine[]
): Promise<LocationGroupedAggregatedSaleLineModel[]> => {
    const groupedSales = _.groupBy(aggregatedSales, line =>
        line.location.id
    );

    const aggregatedData = Object.values(groupedSales).map(group => {
        const { location} = group[0];
        return {
            locationName: location.name,
            location: location,
            aggregatedSales: group
        } as LocationGroupedAggregatedSaleLineModel;
    });

    return _.orderBy(aggregatedData, ['locationName']);
};