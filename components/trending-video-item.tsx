import { icons } from "@/constants";
import { VideoType } from "@/types";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";

type TrendingVideoItemProps = {
  item: VideoType;
  activeItem: VideoType;
};
const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

export default function TrendingVideoItem({
  item,
  activeItem,
}: TrendingVideoItemProps) {
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
    <Animatable.View
      style={[
        styles.container,
        {
          marginRight: 14,
          borderRadius: 10,
        },
      ]}
      animation={activeItem.documentId === item.documentId ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{
            uri: item.video,
          }}
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          style={styles.video}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setPlay(true)}
          style={styles.touchableOpacity}
          activeOpacity={0.7}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            style={styles.imageBackground}
            resizeMode="cover"
          />
          <Image source={icons.play} style={styles.playIcon} />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 200,
  },
  touchableOpacity: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  imageBackground: {
    width: 150,
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
  },
  playIcon: {
    width: 40,
    height: 40,
    position: "absolute",
    tintColor: "#fff",
  },
  video: {
    width: 150,
    height: 200,
    backgroundColor: "black",
    borderRadius: 10,
  },
});
