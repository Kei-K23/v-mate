import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  handleOnPress: () => void;
  containerStyle?: {};
  isLoading?: boolean;
  variant?: "primary" | "gray";
};

export default function Button({
  title,
  handleOnPress,
  containerStyle,
  isLoading,
  variant = "primary",
}: ButtonProps) {
  let btnVariant = {};
  switch (variant) {
    case "primary":
      btnVariant = styles.primary;
      break;
    case "gray":
      btnVariant = styles.gray;
      break;
    default:
      btnVariant = styles.primary;
      break;
  }

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={handleOnPress}
      style={[btnVariant, styles.btn, containerStyle]}
    >
      <Text style={[styles.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginVertical: 15,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  primary: {
    backgroundColor: colors.secondary.DEFAULT,
  },
  gray: {
    backgroundColor: colors.gray[100],
  },
  text: {
    fontSize: sizes.text,
    fontWeight: "900",
  },
});
