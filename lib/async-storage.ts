import { VideoType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Models } from 'react-native-appwrite';


export const storeData = async (key: string, value: Models.Document | Models.Session | VideoType[]) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e: any) {
        throw new Error(e);
    }
};

export const getStoreData = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) as T : null;
    } catch (e: any) {
        throw new Error(e);
    }
};

export const removeStoredData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e: any) {
        throw new Error(e);
    }
};
