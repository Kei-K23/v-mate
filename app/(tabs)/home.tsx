import SearchInput from "@/components/search-input";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import { getSignInUser } from "@/lib/appwrite";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { Models } from "react-native-appwrite";

export default function HomeScreen() {
  const [signInUser, setSignInUser] =
    useState<Models.User<Models.Preferences>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const singInUserData = await getSignInUser();
        setSignInUser(singInUserData);
      } catch (e: any) {
        // TODO: handle error properly
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={[
        defaultStyles.layout,
        ,
        {
          flex: 1,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        renderItem={({ item }) => (
          <Text style={{ color: "#fff" }}>{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              marginTop: 30,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.gray[100],
                    fontWeight: "600",
                  }}
                >
                  Welcome back,
                </Text>
                <Text
                  style={{
                    color: colors.gray[100],
                    fontSize: sizes.headerTiny,
                    fontWeight: "900",
                  }}
                >
                  {signInUser?.name}
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
          </View>
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
