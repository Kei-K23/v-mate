import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text>Home</Text>
      <Link href={"/about"}>Go to about</Link>
    </View>
  );
}
