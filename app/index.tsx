import Button from "@/components/Button";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
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
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: colors.primary,
          }}
        >
          <Image
            source={images.logo}
            style={{
              width: 130,
              height: 85,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            style={{
              width: 350,
              height: 350,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />
          <View>
            <Text
              style={{
                color: "#fff",
                fontSize: sizes.headerSmallBold,
                textAlign: "center",
                fontWeight: "900",
              }}
            >
              Enjoy the Endless of entertainment with{" "}
              <Text
                style={{
                  color: colors.secondary.DEFAULT,
                }}
              >
                V-Mate
              </Text>
            </Text>
            <Image
              source={images.path}
              style={{
                width: 100,
                height: 20,
                position: "absolute",
                bottom: -13,
                right: 0,
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: colors.gray[100],
              marginTop: 30,
              width: "100%",
              textAlign: "center",
            }}
          >
            Share your arts, creations or even AI generated videos to the world
            with <Text>V-Mate</Text>
          </Text>
          <Button title="Continue with Email" handleOnPress={() => {}} />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
