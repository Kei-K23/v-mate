import Button from "@/components/button";
import FormField from "@/components/form-field";
import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import useShowErrorAlert from "@/hooks/show-error-alert";
import { createNewVideo, getSignInUser, getUser } from "@/lib/appwrite";
import { CreateVideoType, UserType } from "@/types";
import { ResizeMode, Video } from "expo-av";
import { getDocumentAsync } from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateScreen() {
  const showAlert = useShowErrorAlert();
  const [createVideo, setCreateVideo] = useState<CreateVideoType>({
    title: "",
    tag: "",
    video: null,
    thumbnail: null,
    description: "",
  });
  const [signInUser, setSignInUser] = useState<UserType>();

  const handleOnPress = async () => {
    if (
      createVideo.title === "" ||
      createVideo.video === null ||
      createVideo.thumbnail === null ||
      createVideo.tag === ""
    ) {
      showAlert({
        message: "Please fill in all fields!",
      });
      return;
    }

    if (!signInUser) {
      showAlert({
        message: "User not found to create new video!",
      });
      return;
    }

    try {
      await createNewVideo({
        ...createVideo,
        userId: signInUser.$id,
      });

      showAlert({
        message: "Success! Created new video!",
        title: "Success",
      });
      setCreateVideo({
        title: "",
        tag: "",
        video: null,
        thumbnail: null,
        description: "",
      });
      router.replace("/(tabs)/home");
    } catch (e: any) {
      showAlert({
        message: "Error when creating video",
      });
    }
  };

  const openPicker = async (type: "video" | "image") => {
    const result = await getDocumentAsync({
      type:
        type === "image"
          ? ["image/png", "image/jpeg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      // 20MB equal to 2e7 bytes
      if (result.assets[0].size && result.assets[0].size <= 2e7) {
        if (type === "video") {
          setCreateVideo({
            ...createVideo,
            video: result.assets[0],
          });
        }
        if (type === "image") {
          setCreateVideo({
            ...createVideo,
            thumbnail: result.assets[0],
          });
        }
      } else {
        showAlert({
          message: "Exceeded the size limit. Only allow 20MB maximum",
        });
      }
    } else {
      showAlert({
        message: "Error when uploading asset",
      });
    }
  };

  // fetch user information
  useEffect(() => {
    const fetchData = async () => {
      try {
        const singInUserData = await getSignInUser();

        const user = await getUser(singInUserData.$id);
        setSignInUser(user);
      } catch (e: any) {
        showAlert({
          message: "Error when fetching user information",
        });
      }
    };

    fetchData();

    return () => {
      // TODO: check here
      // cleanup the fields when component is destroyed
      setCreateVideo({
        title: "",
        tag: "",
        video: null,
        thumbnail: null,
        description: "",
      });
    };
  }, []);

  return (
    <ScrollView
      style={[
        defaultStyles.layout,
        ,
        {
          flex: 1,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: sizes.headerTiny,
          fontWeight: "800",
          marginTop: 40,
        }}
      >
        Upload Video
      </Text>
      <FormField
        value={createVideo.title}
        label="Video Title"
        placeholder="Enter video title"
        handleOnChange={(text) =>
          setCreateVideo({
            ...createVideo,
            title: text,
          })
        }
        keyboardType="default"
      />
      <View
        style={{
          marginTop: 16,
        }}
      >
        <Text
          style={{
            color: colors.gray[100],
            fontWeight: "600",
          }}
        >
          Upload video
        </Text>

        <TouchableOpacity
          onPress={() => openPicker("video")}
          style={{
            marginVertical: 10,
          }}
        >
          {createVideo.video ? (
            <Video
              source={{ uri: createVideo.video.uri }}
              resizeMode={ResizeMode.COVER}
              style={[styles.container]}
              isMuted
            />
          ) : (
            <View>
              <View style={[styles.container]}>
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: colors.secondary.DEFAULT,
                    padding: 20,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginTop: 10,
                    color: colors.gray[200],
                    fontSize: sizes.textTiny,
                    fontWeight: "600",
                  }}
                >
                  Click here to upload
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 16,
        }}
      >
        <Text
          style={{
            color: colors.gray[100],
            fontWeight: "600",
          }}
        >
          Upload video thumbnail
        </Text>

        <TouchableOpacity
          onPress={() => openPicker("image")}
          style={{
            marginVertical: 10,
          }}
        >
          {createVideo.thumbnail ? (
            <Image
              source={{ uri: createVideo.thumbnail.uri }}
              resizeMode="contain"
              style={[styles.container]}
            />
          ) : (
            <View>
              <View style={[styles.container]}>
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: colors.secondary.DEFAULT,
                    padding: 20,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginTop: 10,
                    color: colors.gray[200],
                    fontSize: sizes.textTiny,
                    fontWeight: "600",
                  }}
                >
                  Click here to upload
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <FormField
          value={createVideo.tag}
          label="Tag"
          placeholder="Enter video tags"
          handleOnChange={(text) =>
            setCreateVideo({
              ...createVideo,
              tag: text,
            })
          }
          keyboardType="default"
        />
        <Text
          style={{
            color: colors.gray[200],
            fontSize: sizes.textTiny,
          }}
        >
          Make sure video tag is comma separated value.
        </Text>
      </View>
      <FormField
        value={createVideo.description}
        label="Description"
        placeholder="Enter video description"
        handleOnChange={(text) =>
          setCreateVideo({
            ...createVideo,
            description: text,
          })
        }
        keyboardType="default"
      />
      <Button title="Create" handleOnPress={handleOnPress} />
      <View
        style={{
          height: 50,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 130,
    backgroundColor: colors.black[200],
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
