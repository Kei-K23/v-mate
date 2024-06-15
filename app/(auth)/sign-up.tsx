import Button from "@/components/button";
import FormField from "@/components/form-field";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import { createUser, signInUser } from "@/lib/appwrite";
import useUserSessionStore from "@/store/useUserSessionStore";
// import { userSessionStorage } from "@/store/userSessionStore";
import { UserSignUp } from "@/types";
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

export default function SignUpScreen() {
  const router = useRouter();
  // TODO : Check the state is working fine
  const [signUp, setSignUp] = useState<UserSignUp>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isStartTransition, setIsStartTransition] = useState<boolean>(false);
  const { setDocument, setSession } = useUserSessionStore();

  const handleOnPress = async () => {
    setIsStartTransition(true);
    try {
      const user = await createUser(signUp);
      setDocument(user);

      const session = await signInUser({
        email: signUp.email,
        password: signUp.password,
      });
      setSession(session);

      router.push("/(tabs)/home");
    } catch (e) {
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
            Register to V-Mate
          </Text>
          <FormField
            value={signUp.username}
            label="Username"
            placeholder="Enter your username"
            handleOnChange={(text) =>
              setSignUp({
                ...signUp,
                username: text,
              })
            }
            keyboardType="default"
          />
          <FormField
            value={signUp.email}
            label="Email"
            placeholder="Enter your email"
            handleOnChange={(text) =>
              setSignUp({
                ...signUp,
                email: text,
              })
            }
            keyboardType="email-address"
          />
          <FormField
            value={signUp.password}
            label="Password"
            placeholder="Enter your password"
            handleOnChange={(text) =>
              setSignUp({
                ...signUp,
                password: text,
              })
            }
            keyboardType="default"
          />
          <FormField
            value={signUp.confirmPassword}
            label="Confirm Password"
            placeholder="Enter your confirm password"
            handleOnChange={(text) =>
              setSignUp({
                ...signUp,
                confirmPassword: text,
              })
            }
            keyboardType="default"
          />
          <Button
            isLoading={isStartTransition}
            title="Sign up"
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
              Already have an account?{" "}
            </Text>
            <Link
              style={{
                color: colors.secondary[100],
                marginTop: 10,
              }}
              href={"/(auth)/sign-in"}
            >
              Sign in here!
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
