// ใน utils/LanguageContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { getCurrentLocale, setLocale as setI18nLocale } from './i18n';

type SupportedLocale = 'en' | 'th';

// สร้าง type สำหรับ context
type LanguageContextType = {
  currentLanguage: SupportedLocale;
  toggleLanguage: () => Promise<void>;
};

// สร้าง context
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  toggleLanguage: async () => {},
});

// สร้าง provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLocale>(getCurrentLocale());

  // ใช้ useMemo เพื่อจำค่า value object และสร้างใหม่เฉพาะเมื่อ currentLanguage เปลี่ยน
  const contextValue = useMemo(() => {
    const toggleLanguage = async (): Promise<void> => {
      const newLocale = currentLanguage === 'en' ? 'th' : 'en';
      await setI18nLocale(newLocale);
      setCurrentLanguage(newLocale);
    };

    return { currentLanguage, toggleLanguage };
  }, [currentLanguage]); // dependency array - สร้างใหม่เฉพาะเมื่อ currentLanguage เปลี่ยน

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// สร้าง custom hook เพื่อใช้งาน context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;