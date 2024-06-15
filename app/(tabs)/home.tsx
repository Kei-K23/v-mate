import useUserSessionStore from "@/store/useUserSessionStore";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const document = useUserSessionStore().getDocument();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#000",
        }}
      >
        Home page {document?.$id}
      </Text>
    </View>
  );
}
