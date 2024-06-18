import NotFound from "@/components/not-found";
import VideoCard from "@/components/video-card";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { storageKeys } from "@/constants/storage-key";
import { defaultStyles } from "@/constants/styles";
import useShowErrorAlert from "@/hooks/show-error-alert";
import { getSignInUser, getUser } from "@/lib/appwrite";
import { getStoreData } from "@/lib/async-storage";
import { UserType, VideoType } from "@/types";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, Text } from "react-native";

export default function BookMarkScreen() {
  const [savedVideosInStorage, setSavedVideosInStorage] = useState<VideoType[]>(
    []
  );
  const [user, setUser] = useState<UserType>();
  const showAlert = useShowErrorAlert();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async (fn: () => Promise<void>) => {
    setIsRefreshing(true);
    await fn();
    setIsRefreshing(false);
  }, []);

  const fetchData = async () => {
    try {
      const storedBookmarkVideos = await getStoreData<VideoType[]>(
        storageKeys.bookmark
      );
      setSavedVideosInStorage(storedBookmarkVideos ?? []);

      const singInUserData = await getSignInUser();
      const user = await getUser(singInUserData.$id);
      setUser(user);
    } catch (e) {
      console.log(e);
      showAlert({
        message: "Something went wrong",
      });
    }
  };

  useEffect(() => {
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
      <Text
        style={{
          color: "#fff",
          fontSize: sizes.headerTiny,
          fontWeight: "800",
          marginTop: 40,
          marginBottom: 30,
        }}
      >
        Bookmark videos
      </Text>

      <FlatList
        data={savedVideosInStorage}
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            userId={user?.$id!}
            onRefresh={onRefresh}
            videosRefreshFn={fetchData}
          />
        )}
        ListEmptyComponent={() => (
          <NotFound
            title="No bookmark video yet"
            description="Create a new bookmark video"
            btnText="Create bookmark video"
            url="/(tabs)/home"
          />
        )}
        keyExtractor={(item) => item.$id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh(fetchData)}
          />
        }
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
