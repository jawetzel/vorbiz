import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { themeColors } from "@/constants/theme-colors";
import SaleLineModel from "@/services/local-data/models/sale-line-model";
import database from "@/services/local-data/context";
import {
    GetDateRangeForMonth,
    getEndOfDay,
    GetRecentMonthYearOptions,
    getStartOfDay,
    MonthYearViewModel
} from "@/utils/date-utils";
import {Picker} from "@react-native-picker/picker";
import {CommonInputStyles} from "@/components/ui/inputs/input-styles";
import {taxBreakdownByState} from "@/services/local-data/views/reporting/tax/state-tax-reporting-views";
import {taxBreakdownByJurisdiction} from "@/services/local-data/views/reporting/tax/local-taxt-report-view";

const SalesTaxReport = () => {
    const monthYearOptions = GetRecentMonthYearOptions();

    const defaultRange = GetDateRangeForMonth(monthYearOptions[1]);

    const [startDate, setStartDate] = useState(defaultRange.firstDay);
    const [endDate, setEndDate] = useState(defaultRange.lastDay);


    const [selectedMonthYear, setSelectedMonthYear] = useState<MonthYearViewModel>(monthYearOptions[1]);
    const [reportDisplayMonthYear, setReportDisplayMonthYear] = useState<MonthYearViewModel | null>(null);

    const [showReport, setShowReport] = useState(false);

    const RunReport = async () => {
        const dayStart = getStartOfDay(startDate);
        const dayEnd = getEndOfDay(endDate);
        const reportData = await SaleLineModel.saleLinesByDateRange(database, dayStart, dayEnd);
        const stateSalesTax = taxBreakdownByState(reportData);
        const jurisdictionTaxes = taxBreakdownByJurisdiction(reportData);
        //todo we need to break this down by location state, parish, & tax zone
        //todo we need a breakdown by state
        //todo we need to look into the common cases for local & state taxes for what data we might be missing
        setReportDisplayMonthYear(selectedMonthYear);
        setShowReport(true);
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Date Range Report</Text>

                <View style={CommonInputStyles.fieldContainer}>
                    <View style={[styles.textInputContainer, styles.dropdownContainer]}>
                        <Picker
                            selectedValue={monthYearOptions.find(
                                option =>
                                    option.month === selectedMonthYear.month &&
                                    option.year === selectedMonthYear.year
                            )}
                            onValueChange={(value) => {
                                setSelectedMonthYear(value);
                                const selectedDateRange = GetDateRangeForMonth(value);
                                setStartDate(selectedDateRange.firstDay);
                                setEndDate(selectedDateRange.lastDay);
                            }}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            {monthYearOptions.map((option) => (
                                <Picker.Item
                                    key={`${option.month}-${option.year}`}
                                    label={`${option.month}/${option.year}`}
                                    value={option}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>



                <View>
                    <TouchableOpacity
                        onPress={RunReport}
                        style={styles.runReportButton}
                    >
                        <Text style={styles.runReportButtonText}>Generate Report</Text>
                    </TouchableOpacity>
                </View>
            </View>






            {showReport && (
                <View style={styles.reportContainer}>
                    <Text>{`Sales Tax Report - ${reportDisplayMonthYear?.month ?? ''}/${reportDisplayMonthYear?.year ?? ''}`}</Text>
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
        paddingVertical: 10,
        paddingHorizontal: 20,
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

    runReportButton: {
        backgroundColor: themeColors.primaryTwo,
        borderRadius: 12,
        padding: 8,
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
    textInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        minHeight: 40,
    },

    dropdownContainer: {
        justifyContent: 'center',
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },
    picker: {
        flex: 1,
        marginTop: -13,
        height: 65,
        marginHorizontal: 2,
        fontSize: 14
    },
    pickerItem: {
        height: 45,
        fontSize: 14,
    }
});

export default SalesTaxReport;