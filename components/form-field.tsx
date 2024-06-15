import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormFieldProps = {
  label: string;
  placeholder: string;
  handleOnChange: (text: string) => void;
  keyboardType:
    | "default"
    | "numeric"
    | "email-address"
    | "numbers-and-punctuation"
    | "url"
    | "number-pad"
    | "phone-pad"
    | "name-phone-pad"
    | "web-search"
    | "visible-password";
};

export default function FormField({
  label,
  placeholder,
  handleOnChange,
  keyboardType = "default",
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);

  return (
    <View
      style={{
        marginTop: 16,
      }}
    >
      <Text style={[styles.label]}>{label}</Text>
      <View>
        <TextInput
          placeholderTextColor={"gray"}
          placeholder={placeholder}
          onChangeText={handleOnChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, isFocused && styles.inputFocused]}
          keyboardType={keyboardType}
          selectionColor={colors.secondary[100]}
          secureTextEntry={label === "Password" && !isTextVisible}
        />
        {label === "Password" && (
          <TouchableOpacity
            onPress={() => setIsTextVisible(!isTextVisible)}
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={isTextVisible ? icons.eye : icons.eyeHide}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.black[200],
    height: 50,
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: sizes.text,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  inputFocused: {
    borderColor: colors.secondary.DEFAULT,
  },
  label: {
    color: colors.gray[100],
    fontWeight: "600",
  },
});
