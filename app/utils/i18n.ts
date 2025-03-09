// src/i18n.ts
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the translation files
import enTranslations from '@/assets/translations/en';
import thTranslations from '@/assets/translations/th';
import { TranslationKeys } from '@/assets/translations/translations';

// Define supported locales
export type SupportedLocale = 'en' | 'th';

// Define translations object with typed keys
const translations = {
  en: enTranslations,
  th: thTranslations,
};

// สร้าง instance ใหม่ของ I18n
const i18nInstance = new I18n(translations);

// กำหนดค่าเริ่มต้น
i18nInstance.defaultLocale = 'en';
i18nInstance.enableFallback = true;

// สร้าง wrapper object ที่มี type safety
const i18n = {
  ...i18nInstance,
  // Override t method with type-safe version
  t: (key: keyof TranslationKeys, options?: any): string => {
    return i18nInstance.t(key, options);
  }
};

// Set the locale once at the beginning of your app
export const setLocale = async (locale: SupportedLocale): Promise<void> => {
  i18nInstance.locale = locale;
  try {
    await AsyncStorage.setItem('userLocale', locale);
  } catch (error) {
    console.error('Error saving locale', error);
  }
};

// Function to initialize the language from storage or device
export const initLanguage = async (): Promise<void> => {
  try {
    // Check if user has previously set a language preference
    const userLocale = await AsyncStorage.getItem('userLocale') as SupportedLocale | null;
    
    if (userLocale && (userLocale === 'en' || userLocale === 'th')) {
      // Use saved preference
      i18nInstance.locale = userLocale;
    } else {
      // ใช้ getLocales() แทน locale property ที่ deprecated
      const locales = Localization.getLocales();
      const deviceLangCode = locales && locales.length > 0 ? locales[0].languageCode : 'en';
      
      // ตรวจสอบว่าภาษาอุปกรณ์อยู่ในภาษาที่รองรับหรือไม่
      i18nInstance.locale = (deviceLangCode === 'en' || deviceLangCode === 'th') 
        ? deviceLangCode 
        : 'en';
    }
  } catch (error) {
    console.error('Error loading locale', error);
    i18nInstance.locale = 'en'; // Fallback to English
  }
};

// Helper function to access the current locale
export const getCurrentLocale = (): SupportedLocale => {
  return i18nInstance.locale as SupportedLocale;
};

export default i18n;