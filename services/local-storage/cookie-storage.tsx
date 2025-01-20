import AsyncStorage from '@react-native-async-storage/async-storage';

export const CookieStorageKeyDefs = {
    SalesLocation: 'SalesLocation',
}


export const CookieStorageStoreData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('Error saving data', error);
    }
};

export const CookieStorageGetData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? value : null;
    } catch (error) {
        console.error('Error reading data', error);
        return null;
    }
};