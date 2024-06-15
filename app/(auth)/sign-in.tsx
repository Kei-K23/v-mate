import Button from "@/components/button";
import FormField from "@/components/form-field";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function SignInScreen() {
  // TODO : Check the state is working fine
  const [signIn, setSignIn] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

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
            value={signIn.email}
            label="Email"
            placeholder="Enter your email"
            handleOnChange={(text) =>
              setSignIn({
                ...signIn,
                email: text,
              })
            }
            keyboardType="email-address"
          />
          <FormField
            value={signIn.password}
            label="Password"
            placeholder="Enter your password"
            handleOnChange={(text) =>
              setSignIn({
                ...signIn,
                password: text,
              })
            }
            keyboardType="default"
          />
          <Button title="Sign in" handleOnPress={() => {}} />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
