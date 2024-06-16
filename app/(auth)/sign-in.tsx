import Button from "@/components/button";
import FormField from "@/components/form-field";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { storageKeys } from "@/constants/storage-key";
import { defaultStyles } from "@/constants/styles";
import { signInUser } from "@/lib/appwrite";
import { storeData } from "@/lib/async-storage";
import { UserSignIn } from "@/types";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";

export default function SignInScreen() {
  // TODO : Check the state is working fine
  const [signIn, setSignIn] = useState<UserSignIn>({
    email: "",
    password: "",
  });
  const [isStartTransition, setIsStartTransition] = useState<boolean>(false);
  const router = useRouter();

  const handleOnPress = async () => {
    // TODO : handle proper error
    if (signIn.email === "" || signIn.password === "") return;

    setIsStartTransition(true);
    try {
      const session = await signInUser({
        email: signIn.email,
        password: signIn.password,
      });
      // set to async storage
      storeData(storageKeys.session, session);
      router.push("/(tabs)/home");
    } catch (e) {
      console.log(e);

      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Something went wrong when signing up",
          ToastAndroid.BOTTOM
        );
      }
      if (Platform.OS === "ios") {
        Alert.alert("Error", "Something went wrong when signing up");
      }
    } finally {
      setIsStartTransition(false);
    }
  };

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
              marginTop: 30,
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
          <Button
            isLoading={isStartTransition}
            title="Sign in"
            handleOnPress={handleOnPress}
          />
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "#fff",
                marginTop: 10,
              }}
            >
              Don't have an account?{" "}
            </Text>
            <Link
              style={{
                color: colors.secondary[100],
                marginTop: 10,
              }}
              href={"/(auth)/sign-up"}
            >
              Sign up here!
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
