import { images } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";
import Button from "./button";
import { router } from "expo-router";
import { sizes } from "@/constants/sizes";
import { colors } from "@/constants/colors";

type NotFoundProps = {
  title: string;
  description: string;
  url: string;
};

export default function NotFound({ title, description, url }: NotFoundProps) {
  return (
    <View
      style={{
        marginVertical: 40,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={images.empty}
          style={{
            width: 140,
            height: 60,
            marginBottom: 20,
          }}
        />
      </View>
      <View>
        <Text
          style={{
            color: "#fff",
            fontSize: sizes.headerTiny,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: colors.gray[100],
            fontSize: 12,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          {description}
        </Text>
      </View>
      <Button title="Create video" handleOnPress={() => router.replace(url)} />
    </View>
  );
}
