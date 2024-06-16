import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SearchInputProps = {
  query?: string;
};
export default function SearchInput({ query }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState<string>(query ?? "");

  const handleOnPress = () => {
    router.push(`/search/${search}`);
  };
  return (
    <View
      style={{
        marginTop: 16,
      }}
    >
      <TextInput
        value={search}
        placeholderTextColor={"gray"}
        placeholder={"Search the videos..."}
        onChangeText={setSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input, isFocused && styles.inputFocused]}
        selectionColor={colors.secondary[100]}
      />

      <TouchableOpacity
        onPress={handleOnPress}
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
          source={icons.search}
          style={{
            width: 20,
            height: 20,
          }}
        />
      </TouchableOpacity>
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
