import { icons } from "@/constants";
import { VideoType } from "@/types";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type VideoCardProps = {
  item: VideoType;
  // avatar: string;
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
    <View>
      <View>
        <View>
          <View>
            <Image source={{ uri: "" }} resizeMode="cover" />
          </View>

          <View>
            <Text numberOfLines={1}>{item.title}</Text>
            <Text numberOfLines={1}>{item.creator}</Text>
          </View>
        </View>

        <View>
          <Image source={icons.menu} resizeMode="contain" />
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
        <TouchableOpacity activeOpacity={0.7} onPress={() => setPlay(true)}>
          <Image source={{ uri: item.thumbnail }} resizeMode="cover" />

          <Image source={icons.play} resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}
