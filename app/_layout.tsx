import {DarkTheme, DefaultTheme, ParamListBase, RouteProp, Theme, ThemeProvider} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
    NativeStackNavigationProp, NativeStackScreenProps
} from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import database from '../services/local-data/context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHospital, faMoneyBill1, faEdit } from '@fortawesome/free-regular-svg-icons'; // Import the icons you want to use
import { faQrcode, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import ManageScreen from "@/app/(tabs)/manage/index";
import LocationScreen from "@/app/(tabs)/manage/locations/index";
import LocationDetailScreen from "@/app/(tabs)/manage/locations/[id]";
import ProductsScreen from "@/app/(tabs)/manage/products";
import ProductDetailScreen from "@/app/(tabs)/manage/products/[id]";
import {themeColors} from "@/constants/theme-colors";
import SaleScreen from "@/app/(tabs)/manage/sales";
import {TouchableOpacity, Text} from "react-native";
import {RootStackParamList} from "@/models/ProjectRouteParams";
import ReportingScreen from "@/app/(tabs)/reporting";
import OneDayReport from "@/app/(tabs)/reporting/reports/one-day-report";
import DateRangeReport from "@/app/(tabs)/reporting/reports/date-range-report";
import SalesTaxReport from "@/app/(tabs)/reporting/reports/sales-tax-report";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// Create the stack navigator for the "Manage" section
const ManageStack = createNativeStackNavigator();
const ScreenOptions = {
    headerStyle: {
        backgroundColor: themeColors.primary,
        // @ts-ignore
        elevation: 0, // Removes shadow on Android
        shadowOpacity: 0, // Removes shadow on iOS
    },
    headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themeColors.headerTitle
    },
    headerTitleAlign: 'center', // Optional alignment
    headerTitle: "Vorbiz",
    headerLargeTitle: true
} as NativeStackNavigationOptions;


function ReportingStackNavigator(){
    return <ManageStack.Navigator screenOptions={ScreenOptions}>
        <ManageStack.Screen
            name="Reporting"
            component={ReportingScreen}
        />
        <ManageStack.Screen name="OneDayReport" component={OneDayReport}/>
        <ManageStack.Screen name="DateRangeReport" component={DateRangeReport}/>
        <ManageStack.Screen name="SalesTaxReport" component={SalesTaxReport}/>

    </ManageStack.Navigator>
}


function ManageStackNavigator() {
    return (
      <ManageStack.Navigator screenOptions={ScreenOptions}>
        <ManageStack.Screen
            name="Management Home"
            component={ManageScreen}
        />
          <ManageStack.Screen name="Locations" component={LocationScreen} />
          <ManageStack.Screen name="LocationDetail" component={LocationDetailScreen}/>
          <ManageStack.Screen name="Products" component={ProductsScreen} />
          <ManageStack.Screen name="ProductDetail" component={ProductDetailScreen}
                              initialParams={{ showQrCode: false }}
                              options={({ navigation, route }: {
                                  navigation: NativeStackNavigationProp<ParamListBase, string>;
                                  route: RouteProp<ParamListBase, string>;
                                  theme: Theme;
                              }) => ({
                                  headerRight: () => (
                                      <TouchableOpacity
                                          style={{
                                              padding: 8,
                                              paddingHorizontal: 15,
                                              backgroundColor: themeColors.primary,
                                              borderRadius: 4,
                                              borderWidth: .5,
                                              borderColor: 'white',
                                          }}
                                          onPressIn={() => {
                                              const currentToggleValue = (route.params as RootStackParamList['ProductDetail'])?.showQrCode || false;
                                              navigation.setParams({ showQrCode: !currentToggleValue });
                                          }}
                                      >
                                          <FontAwesomeIcon icon={faQrcode} size={24} color={themeColors.backgroundThree} />
                                      </TouchableOpacity>
                                  ),
                              })}
          />
      </ManageStack.Navigator>
  );
}

function SalesStackNavigator() {
    return (
        <ManageStack.Navigator screenOptions={ScreenOptions}>
            <ManageStack.Screen
                name="SaleHome"
                component={SaleScreen}
                initialParams={{ toggleQRScanner: false }}
                options={({ navigation, route }: {
                    navigation: NativeStackNavigationProp<ParamListBase, string>;
                    route: RouteProp<ParamListBase, string>;
                    theme: Theme;
                }) => ({
                    headerLeft:  () => (
                        <TouchableOpacity
                            style={{
                                padding: 8,
                                paddingHorizontal: 15,
                                backgroundColor: themeColors.primary,
                                borderRadius: 4,
                                borderWidth: .5,
                                borderColor: 'white',
                            }}
                            onPressIn={() => {
                                const currentToggleValue = (route.params as RootStackParamList['SaleHome'])?.showLocationModal || false;
                                navigation.setParams({ showLocationModal: !currentToggleValue });
                            }}
                        >
                            <FontAwesomeIcon icon={faMapLocation} size={24} color={themeColors.backgroundThree} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            style={{
                                padding: 8,
                                paddingHorizontal: 15,
                                backgroundColor: themeColors.primary,
                                borderRadius: 4,
                                borderWidth: .5,
                                borderColor: 'white',
                            }}
                            onPressIn={() => {
                                const currentToggleValue = (route.params as RootStackParamList['SaleHome'])?.toggleQRScanner || false;
                                navigation.setParams({ toggleQRScanner: !currentToggleValue });
                            }}
                        >
                            <FontAwesomeIcon icon={faQrcode} size={24} color={themeColors.backgroundThree} />
                        </TouchableOpacity>
                    ),
                })}
            />
        </ManageStack.Navigator>
    );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <PaperProvider>
          <DatabaseProvider database={database}>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  {/* Tab Navigator for bottom tabs */}
                  <Tab.Navigator screenOptions={{
                      tabBarStyle: {
                          backgroundColor: themeColors.backgroundThree
                      },
                      tabBarActiveTintColor: themeColors.primary,
                      tabBarInactiveTintColor: themeColors.textLight,
                      headerShown: false,
                  }}>
                      <Tab.Screen name="Reporting"  component={ReportingStackNavigator}

                                  options={{
                                      tabBarIcon: ({ color, size }) => (
                                          <FontAwesomeIcon icon={faFileInvoice} size={size} color={color} />
                                      ),
                                  }}/>
                      <Tab.Screen name="Manage" component={ManageStackNavigator}
                                  options={{
                                      tabBarIcon: ({ color, size }) => (
                                          <FontAwesomeIcon icon={faEdit} size={size} color={color} />
                                      )}}
                      />
                      <Tab.Screen   name={"Sale"} component={SalesStackNavigator}
                                    options={{
                                        tabBarIcon: ({ color, size }) => (
                                            <FontAwesomeIcon icon={faMoneyBill1} size={size} color={color} />
                                        )}}
                      />
                      {/* Add other screens as needed */}
                  </Tab.Navigator>
                  <StatusBar style="auto" />
              </ThemeProvider>
          </DatabaseProvider>
      </PaperProvider>
  );
}
