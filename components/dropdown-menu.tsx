import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import { storageKeys } from "@/constants/storage-key";
import useShowErrorAlert from "@/hooks/show-error-alert";
import { deleteTheVideo } from "@/lib/appwrite";
import { getStoreData, storeData } from "@/lib/async-storage";
import { VideoType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type DropdownMenuProps = {
  isOwner: boolean;
  video: VideoType;
  onRefresh: (fn: () => Promise<void>) => Promise<void>;
  videosRefreshFn: () => Promise<void>;
};

export default function DropdownMenu({
  isOwner,
  video,
  onRefresh,
  videosRefreshFn,
}: DropdownMenuProps) {
  const [show, setShow] = useState<boolean>(false);
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

  const handleOnPress = async (type: "delete" | "save" | "edit") => {
    try {
      switch (type) {
        case "delete":
          await deleteTheVideo(video.$id);
          setShow(false);
          onRefresh(videosRefreshFn);
          showAlert({
            message: "Successfully delete the video",
            title: "Success",
          });
          break;
        case "save":
          await saveTheVideoInStorage();
          setShow(false);
          break;
        case "edit":
          setShow(false);
          break;
        default:
          setShow(false);
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
        position: "absolute",
        right: 5,
        top: 0,
      }}
    >
      {show ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
            borderWidth: 1,
            borderColor: colors.gray[200],
            borderRadius: 10,
            backgroundColor: colors.primary,
            shadowColor: colors.gray[100],
            shadowOffset: {
              width: 100,
              height: 10,
            },
          }}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              paddingHorizontal: 20,
              paddingVertical: 8,
              gap: 5,
              borderColor: colors.gray[200],
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
                  borderBottomWidth: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderColor: colors.gray[200],
                  gap: 5,
                }}
                onPress={() => handleOnPress("edit")}
              >
                <Ionicons
                  name="pencil-outline"
                  color={colors.gray[200]}
                  size={16}
                />
                <Text
                  style={{
                    color: colors.gray[200],
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderColor: colors.gray[200],
                  gap: 5,
                }}
                onPress={() => handleOnPress("delete")}
              >
                <Ionicons name="trash-bin" color={colors.gray[200]} size={16} />
                <Text
                  style={{
                    color: colors.gray[200],
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShow(true)}>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={{
              width: 17,
              height: 17,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
