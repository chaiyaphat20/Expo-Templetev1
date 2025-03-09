import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

// กำหนด Props สำหรับ TextInputForm
interface TextInputFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  label?: string;
  name: TName;
  control: Control<TFieldValues>;
  placeholder?: string;
  secureTextEntry?: boolean;
  rules?: object;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  isRequired?: boolean;
}

// คอมโพเนนต์ TextInputForm ที่ใช้ Controller จาก react-hook-form
function TextInputForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  placeholder = '',
  secureTextEntry = false,
  rules = {},
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  isRequired = false,
}: Readonly<TextInputFormProps<TFieldValues, TName>>) {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {isRequired && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              value={value as string}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              multiline={multiline}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              editable={editable}
              style={[
                styles.input,
                multiline && styles.multilineInput,
                error && styles.errorInput,
              ]}
            />
            {error && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}
          </>
        )}
      />
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

export default TextInputForm;