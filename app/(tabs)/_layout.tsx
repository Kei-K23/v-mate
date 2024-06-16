import { icons } from "@/constants";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

type TabIconProps = {
  icon: ImageSourcePropType | undefined;
  color: string;
  name: string;
};

const TabIcon = ({ icon, color, name }: TabIconProps) => {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{
          width: 22,
          height: 22,
        }}
      />
      <Text
        style={{
          color: color,
          fontSize: 12,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "232533",
          height: 64,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon name="Home" color={color} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: "Bookmark",
          tabBarIcon: ({ color }) => (
            <TabIcon name="Bookmark" color={color} icon={icons.bookmark} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <TabIcon name="Create" color={color} icon={icons.plus} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabIcon name="Profile" color={color} icon={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
}
