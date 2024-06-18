import { colors } from "@/constants/colors";
import { storageKeys } from "@/constants/storage-key";
import useShowErrorAlert from "@/hooks/show-error-alert";
import { deleteTheVideo } from "@/lib/appwrite";
import { getStoreData, storeData } from "@/lib/async-storage";
import { VideoType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type DropdownMenuProps = {
  isOwner: boolean;
  video: VideoType;
  onRefresh: (fn: () => Promise<void>) => Promise<void>;
  videosRefreshFn: () => Promise<void>;
};

export default function ActionsGroup({
  isOwner,
  video,
  onRefresh,
  videosRefreshFn,
}: DropdownMenuProps) {
  const showAlert = useShowErrorAlert();
  const [savedVideosInStorage, setSavedVideosInStorage] = useState<VideoType[]>(
    []
  );

  const saveTheVideoInStorage = async () => {
    try {
      if (!savedVideosInStorage?.length) {
        const bookmarkVideos: VideoType[] = [];
        bookmarkVideos.push(video);
        await storeData(storageKeys.bookmark, bookmarkVideos);

        // update the current state of storage video
        setSavedVideosInStorage(bookmarkVideos);
      } else {
        const bookmarkVideos: VideoType[] = savedVideosInStorage;
        bookmarkVideos.push(video);
        await storeData(storageKeys.bookmark, bookmarkVideos);

        // update the current state of storage video
        setSavedVideosInStorage(bookmarkVideos);
      }
      showAlert({
        message: "Successfully saved bookmark video",
        title: "Success",
      });
    } catch (e: any) {
      showAlert({
        message: "Error when saving bookmark video",
      });
    }
  };

  const removeTheVideoInStorage = async () => {
    try {
      if (savedVideosInStorage?.length) {
        const bookmarkVideos: VideoType[] = savedVideosInStorage;
        const newBookmarkVideos = bookmarkVideos.filter(
          (v) => v.$id !== video.$id
        );
        await storeData(storageKeys.bookmark, newBookmarkVideos);
        // update the current state of storage video
        setSavedVideosInStorage(newBookmarkVideos);
      }
      showAlert({
        message: "Successfully unsaved video",
        title: "Success",
      });
    } catch (e: any) {
      showAlert({
        message: "Error when removing bookmark video",
      });
    }
  };

  const handleOnPress = async (type: "delete" | "save") => {
    try {
      switch (type) {
        case "delete":
          await deleteTheVideo(video.$id);
          onRefresh(videosRefreshFn);
          showAlert({
            message: "Successfully delete the video",
            title: "Success",
          });
          break;
        case "save":
          await saveTheVideoInStorage();
          break;
        default:
          break;
      }
    } catch (e: any) {
      console.log(e);
      showAlert({
        message: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const storedBookmarkVideos = await getStoreData<VideoType[]>(
          storageKeys.bookmark
        );
        setSavedVideosInStorage(storedBookmarkVideos ?? []);
      } catch (e) {
        console.log(e);
        showAlert({
          message: "Something went wrong",
        });
      }
    })();
  }, []);

  const videoExistInStorage = () => {
    return savedVideosInStorage.some((item) => item.$id === video.$id);
  };

  return (
    <View
      style={{
        marginTop: 15,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      }}
    >
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
        onPress={() =>
          videoExistInStorage()
            ? removeTheVideoInStorage()
            : handleOnPress("save")
        }
      >
        <Ionicons name="bookmark" color={colors.gray[200]} size={16} />
        <Text
          style={{
            color: colors.gray[200],
          }}
        >
          {videoExistInStorage() ? "Unsave" : "Save"}
        </Text>
      </TouchableOpacity>
      {isOwner && (
        <>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={() => handleOnPress("delete")}
          >
            <Ionicons name="trash-bin" color={colors.danger[100]} size={16} />
            <Text
              style={{
                color: colors.danger[100],
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
