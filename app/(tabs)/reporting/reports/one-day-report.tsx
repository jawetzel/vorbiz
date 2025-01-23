import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { themeColors } from "@/constants/theme-colors";
import SaleLineModel, {
    groupAggregatedSalesByLocation,
    groupAggregatedSalesByProduct,
    LocationGroupedAggregatedSaleLineModel,
    ProductGroupedAggregatedSaleLineModel,
    SaleAggregationTotals, totalAggregatedSales,
} from "@/services/local-data/models/sale-line-model";
import database from "@/services/local-data/context";
import SalesReport from "@/app/(tabs)/reporting/sales-report";
import {faCalendar, faChevronDown, faQrcode} from '@fortawesome/free-solid-svg-icons'; // Import the icons you want to use
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {getEndOfDay, getStartOfDay} from "@/utils/date-utils";

const OneDayReport = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [salesGroupedByLocation, setSalesGroupedByLocation] =
        useState<LocationGroupedAggregatedSaleLineModel[]>([]);
    const [salesGroupedByProduct, setSalesGroupedByProduct] =
        useState<ProductGroupedAggregatedSaleLineModel[]>([]);
    const [salesTotals, setSalesTotals] =
        useState<SaleAggregationTotals>({} as SaleAggregationTotals);

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
        const dayStart = getStartOfDay(startDate);
        var dayEnd = getEndOfDay(startDate);
        const reportData = await SaleLineModel.aggregatedSalesByDateRange(database, dayStart, dayEnd);

        setShowReport(true);
        setSalesGroupedByLocation(await groupAggregatedSalesByLocation(reportData));
        setSalesGroupedByProduct(await groupAggregatedSalesByProduct(reportData));
        setSalesTotals(await totalAggregatedSales(reportData));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Single Day Report</Text>
                <Text style={styles.headerSubtitle}>View sales data for a specific date</Text>
            </View>

            <View style={styles.dateSection}>
                <TouchableOpacity
                    onPress={showDatepicker}
                    style={styles.dateButton}
                >
                    <View style={styles.dateButtonContent}>
                        <Text style={styles.iconContainer}>
                            <FontAwesomeIcon icon={faCalendar} size={24} color={themeColors.secondary} />
                        </Text>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.dateLabel}>Selected Date</Text>
                            <Text style={styles.dateValue}>{formatDisplayDate(startDate)}</Text>
                        </View>
                        <Text style={styles.iconContainer}>
                            <FontAwesomeIcon icon={faChevronDown} size={24} color={themeColors.secondary} />
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={EndOfDayReport}
                    style={styles.runReportButton}
                >
                    <Text style={styles.runReportButtonText}>Generate Report</Text>
                </TouchableOpacity>
            </View>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            {showReport && (
                <View style={styles.reportContainer}>
                    <SalesReport
                        locationGroupedData={salesGroupedByLocation}
                        productGroupedData={salesGroupedByProduct}
                        totals={salesTotals}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    headerContainer: {
        padding: 20,
        backgroundColor: themeColors.backgroundThree,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borders,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: themeColors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: themeColors.textLight,
    },
    dateSection: {
        padding: 16,
        gap: 16,
    },
    dateButton: {
        backgroundColor: themeColors.backgroundThree,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borders,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dateButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 24,
        height: 24,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dateTextContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    dateLabel: {
        fontSize: 14,
        color: themeColors.textLight,
        marginBottom: 2,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: themeColors.text,
    },
    runReportButton: {
        backgroundColor: themeColors.primaryTwo,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    runReportButtonText: {
        color: themeColors.headerTitle,
        fontSize: 16,
        fontWeight: '600',
    },
    reportContainer: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: themeColors.backgroundThree,
    },
});

export default OneDayReport;