import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import database from '../services/local-data/context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHospital, faEdit } from '@fortawesome/free-regular-svg-icons'; // Import the icons you want to use

import ManageScreen from "@/app/(tabs)/manage/index";
import LocationScreen from "@/app/(tabs)/manage/locations/index";
import LocationDetailScreen from "@/app/(tabs)/manage/locations/[id]";
import HomeScreen from "@/app/(tabs)/index";
import ProductsScreen from "@/app/(tabs)/manage/products";
import ProductDetailScreen from "@/app/(tabs)/manage/products/[id]";
import {themeColors} from "@/components/ui/theme-colors";
import {TouchableOpacity, View, Text} from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// Create the stack navigator for the "Manage" section
const ManageStack = createNativeStackNavigator();

// ManageStackNavigator includes the child screens LocationScreen and LocationDetailScreen
function ManageStackNavigator() {

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
      <ManageStack.Navigator
          screenOptions={{
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
          }}
      >
        <ManageStack.Screen
            name="Manage"
            component={ManageScreen}
        />
        <ManageStack.Screen name="Locations" component={LocationScreen} />
        <ManageStack.Screen name="LocationDetail" component={LocationDetailScreen} />
          <ManageStack.Screen name="Products" component={ProductsScreen} />
          <ManageStack.Screen name="ProductDetail" component={ProductDetailScreen} />
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
                      <Tab.Screen name="Home"  component={HomeScreen}
                                  options={{
                                      tabBarIcon: ({ color, size }) => (
                                          <FontAwesomeIcon icon={faHospital} size={size} color={color} />
                                      )
                                  }}/>
                      <Tab.Screen name="Manage" component={ManageStackNavigator}
                                  options={{
                                      tabBarIcon: ({ color, size }) => (
                                          <FontAwesomeIcon icon={faEdit} size={size} color={color} />
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
