import React, {  useEffect } from "react";
import { Button, ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextInputForm from "./components/TextInputForm";
import TextInputForm2 from "./componentsOld/TextInputForm";
import i18n  from "./utils/i18n";
import { useLanguage } from "./utils/LanguageContext";

// กำหนด Schema ด้วย Zod
const userSchema = z.object({
  email: z.string()
    .min(1, { message: "กรุณากรอกอีเมล" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string()
    .min(1, { message: "กรุณากรอกรหัสผ่าน" })
    .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  personalInfo: z.object({
    firstName: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
    lastName: z.string().min(1, { message: "กรุณากรอกนามสกุล" }),
    phone: z.string()
      .min(1, { message: "กรุณากรอกเบอร์โทรศัพท์" })
      .regex(/^\d{10}$/, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก" }),
  }),
  preferences: z.object({
    receiveNewsletters: z.boolean().default(false),
    theme: z.enum(["light", "dark", "system"]).default("system"),
  }),
}).superRefine((data, ctx) => {
  // ตัวอย่างการตรวจสอบข้ามฟิลด์
  if (data.email.includes(data.password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "อีเมลไม่ควรมีรหัสผ่านอยู่ภายใน (เพื่อความปลอดภัย)",
      path: ["email"],
    });
  }
  
  // ตรวจสอบเงื่อนไขพิเศษอื่นๆ
  if (data.personalInfo.firstName === data.personalInfo.lastName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ชื่อและนามสกุลควรแตกต่างกัน",
      path: ["personalInfo.lastName"],
    });
  }
});

// กำหนดประเภทข้อมูลจาก Schema
type UserFormData = z.infer<typeof userSchema>;

export default function RegisterScreen() {
 
  // สร้าง form ด้วย useForm และ zodResolver
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      personalInfo: {
        firstName: "",
        lastName: "",
        phone: "",
      },
      preferences: {
        receiveNewsletters: false,
        theme: "system",
      },
    },
  });

  const {
    control,
    handleSubmit,
  } = form;

  // ฟังก์ชันเมื่อกดส่งฟอร์ม
  const onSubmit = (data: UserFormData) => {
    console.log("ข้อมูลฟอร์ม:", data);
    // ทำอะไรต่อกับข้อมูล เช่น เรียก API ลงทะเบียน
  };

  console.log("Rerender");

  const { currentLanguage, toggleLanguage } = useLanguage();

  // เพิ่ม effect เพื่อตรวจสอบการเปลี่ยนแปลงภาษา
  useEffect(() => {
    console.log("ภาษาปัจจุบัน:", currentLanguage);
    console.log("ข้อความแปล welcome:", i18n.t('welcome'));
  }, [currentLanguage]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
          <Text style={styles.buttonText}>
            {i18n.t('changeLanguage')} (ปัจจุบัน: {currentLanguage})
          </Text>
        </TouchableOpacity>
        
        <Text>{i18n.t('welcome')}</Text>
        <Text style={styles.title}>ลงทะเบียน</Text>
        
        {/* ส่วนข้อมูลบัญชี */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลบัญชี</Text>
          
          <TextInputForm
            label="อีเมล"
            name="email"
            control={control}
            placeholder="กรุณากรอกอีเมล"
            keyboardType="email-address"
            isRequired
          />
          
          <TextInputForm
            label="รหัสผ่าน"
            name="password"
            control={control}
            placeholder="กรุณากรอกรหัสผ่าน"
            secureTextEntry
            isRequired
          />
        </View>
        
        {/* ส่วนข้อมูลส่วนตัว */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
          
          <TextInputForm
            label="ชื่อ"
            name="personalInfo.firstName"
            control={control}
            placeholder="กรุณากรอกชื่อ"
            isRequired
          />
          
          <TextInputForm
            label="นามสกุล"
            name="personalInfo.lastName"
            control={control}
            placeholder="กรุณากรอกนามสกุล"
            isRequired
          />
          
          <TextInputForm
            label="เบอร์โทรศัพท์"
            name="personalInfo.phone"
            control={control}
            placeholder="กรุณากรอกเบอร์โทรศัพท์"
            keyboardType="phone-pad"
            isRequired
          />
        </View>

        {/* ใช้ TextInputForm2 กับฟิลด์หนึ่งเพื่อเปรียบเทียบ */}
        <TextInputForm2
          label="ทดสอบ TextInputForm2"
          keyOfValue="personalInfo.firstName"
          dataForm={form}
          placeholder="ทดสอบ"
          isRequired
        />
        
        {/* ปุ่มส่งฟอร์ม */}
        <Button title="ลงทะเบียน" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});