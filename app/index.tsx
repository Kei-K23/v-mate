import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text>Home</Text>
      <Link href={"/(tabs)/home"}>Go to Home</Link>
    </View>
  );
}
