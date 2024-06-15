import FormField from "@/components/form-field";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function SignInScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primary,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View
          style={[
            defaultStyles.layout,
            {
              marginTop: 80,
            },
          ]}
        >
          <Image
            source={images.logo}
            style={{
              width: 80,
              height: 70,
              alignSelf: "flex-start",
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: "#fff",
              fontSize: sizes.textBold,
              fontWeight: "900",
            }}
          >
            Log in to V-Mate
          </Text>
          <FormField
            label="Email"
            placeholder="Enter your email"
            handleOnChange={() => {}}
            keyboardType="email-address"
          />
          <FormField
            label="Password"
            placeholder="Enter your password"
            handleOnChange={() => {}}
            keyboardType="default"
          />
          <Link href={"/"}>GO back</Link>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
