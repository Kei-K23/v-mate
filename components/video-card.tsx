import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import { VideoType } from "@/types";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type VideoCardProps = {
  item: VideoType;
};
export default function VideoCard({ item }: VideoCardProps) {
  const [play, setPlay] = useState(false);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setPlay(false);
      }
    } else {
      if (status.error) {
        setPlay(false);
        console.error(`Error during playback: ${status.error}`);
      }
    }
  };

  return (
    <View
      style={{
        marginBottom: 50,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 17,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View>
            <Image
              source={{ uri: item.creator.avatar }}
              resizeMode="cover"
              style={{
                width: 50,
                height: 50,
                borderWidth: 1,
                borderColor: colors.secondary[200],
                borderRadius: 7,
              }}
            />
          </View>

          <View>
            <Text
              style={{
                color: "#fff",
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: colors.gray[100],
              }}
              numberOfLines={1}
            >
              {item.creator.username}
            </Text>
          </View>
        </View>

        <View>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={{
              width: 17,
              height: 17,
            }}
          />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: item.video }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      ) : (
        <TouchableOpacity
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 200,
          }}
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: item.thumbnail }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: 200,
              borderRadius: 10,
            }}
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            style={{
              width: 45,
              height: 45,
              position: "absolute",
              tintColor: "#fff",
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
