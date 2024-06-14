import { Stack } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="bookmark" />
      <Stack.Screen name="create" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
