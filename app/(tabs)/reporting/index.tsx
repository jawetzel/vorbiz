import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {themeColors} from "@/constants/theme-colors";
import SaleLineModel, {
    groupAggregatedSalesByLocation,
    groupAggregatedSalesByProduct,
    LocationGroupedAggregatedSaleLineModel,
    ProductGroupedAggregatedSaleLineModel, SaleAggregationTotals,
    totalAggregatedSales
} from "@/services/local-data/models/sale-line-model";
import database from "@/services/local-data/context";
import SalesReport from "@/app/(tabs)/reporting/sales-report";


const ReportingScreen = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [salesGroupedByLocation, setSalesGroupedByLocation] =
        useState<LocationGroupedAggregatedSaleLineModel[]>([])
    const [salesGroupedByProduct, setSalesGroupedByProduct] =
        useState<ProductGroupedAggregatedSaleLineModel[]>([])
    const [salesTotals, setSalesTotals] =
        useState<SaleAggregationTotals>({} as SaleAggregationTotals)
    const formatDisplayDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || startDate;
        setShow(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const EndOfDayReport = async () => {
        const dayStart = dateUtils.getStartOfDay(startDate);
        var dayEnd = dateUtils.getEndOfDay(startDate);
        const reportData = await SaleLineModel.aggregatedSalesByDateRange(database, dayStart, dayEnd);

        setShowReport(true);
        setSalesGroupedByLocation(await groupAggregatedSalesByLocation(reportData));
        setSalesGroupedByProduct(await groupAggregatedSalesByProduct(reportData));
        setSalesTotals(await totalAggregatedSales(reportData));

    }


    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={showDatepicker}
                style={[
                    styles.button,
                    { backgroundColor: themeColors.primary }
                ]}
            >
                <Text style={styles.dateText}>
                    {formatDisplayDate(startDate)}
                </Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            <TouchableOpacity
                onPress={EndOfDayReport}
                style={[
                    styles.button,
                    { backgroundColor: themeColors.primary }
                ]}
            >
                <Text style={styles.dateText}>
                    Run Day Report
                </Text>
            </TouchableOpacity>

            {showReport &&
                <SalesReport
                    locationGroupedData={salesGroupedByLocation}
                    productGroupedData={salesGroupedByProduct}
                    totals={salesTotals}
                />
            }


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: '100%'
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

// Export helper functions separately for reuse
export const dateUtils = {
    getStartOfDay: (date: Date): number => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        return start.getTime();
    },

    getEndOfDay: (date: Date): number => {
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return end.getTime();
    },

    getTimestampRange: (date: Date): { startTimestamp: number, endTimestamp: number } => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return {
            startTimestamp: start.getTime(),
            endTimestamp: end.getTime()
        };
    }
};

export default ReportingScreen;