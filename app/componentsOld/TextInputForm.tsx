import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { UseFormReturn } from 'react-hook-form';

// กำหนด Props สำหรับ TextInputForm
interface TextInputFormProps {
  label?: string;
  keyOfValue: string;
  dataForm: UseFormReturn<any, any, undefined>;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  isRequired?: boolean;
  isNumber?: boolean;
}

// คอมโพเนนต์ TextInputForm ที่ใช้ setValue และ getValues โดยตรง
function TextInputForm2({
  label,
  keyOfValue,
  dataForm,
  placeholder = '',
  secureTextEntry = false,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  isRequired = false,
  isNumber = false,
}: Readonly<TextInputFormProps>) {
  const {
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
  } = dataForm;

  // ตรวจสอบว่ามี error สำหรับฟิลด์นี้หรือไม่
  const isError = !!errors[keyOfValue];
  // ดึงข้อความ error ถ้ามี
  const errorMessage = errors[keyOfValue]?.message as string | undefined;

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {isRequired && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <TextInput
        value={getValues(keyOfValue)}
        onChangeText={text => {
          let processedText = text;
          if (isNumber) {
            // ถ้าเป็นตัวเลข ให้กรองเฉพาะตัวเลขและจุดทศนิยม
            processedText = text.replace(/[^0-9.]/g, '');
          }
          setValue(keyOfValue, processedText);
          clearErrors(keyOfValue);
        }}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={isNumber ? 'numeric' : keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          isError && styles.errorInput,
        ]}
      />

      {isError && (
        <Text style={styles.errorText}>{errorMessage || `กรุณากรอก${label}`}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  required: {
    color: 'red',
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextInputForm2;