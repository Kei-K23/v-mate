import NotFound from "@/components/not-found";
import VideoCard from "@/components/video-card";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { storageKeys } from "@/constants/storage-key";
import { defaultStyles } from "@/constants/styles";
import {
  account,
  getSignInUser,
  getUser,
  searchVideosByAccountId,
} from "@/lib/appwrite";
import { getStoreData, removeStoredData } from "@/lib/async-storage";
import { UserType, VideoType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Models } from "react-native-appwrite";

export default function ProfileScreen() {
  const [user, setUser] = useState<UserType>();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [savedVideosInStorage, setSavedVideosInStorage] = useState<VideoType[]>(
    []
  );

  const onRefresh = useCallback(async (fn: () => Promise<void>) => {
    setIsRefreshing(true);
    await fn();
    setIsRefreshing(false);
  }, []);

  const fetchData = async () => {
    try {
      const singInUserData = await getSignInUser();
      const user = await getUser(singInUserData.$id);
      setUser(user);

      const videosData = await searchVideosByAccountId(user.$id);
      setVideos(videosData);

      const storedBookmarkVideos = await getStoreData<VideoType[]>(
        storageKeys.bookmark
      );
      setSavedVideosInStorage(storedBookmarkVideos ?? []);
    } catch (e: any) {
      // TODO: handle error properly
      console.log(e);
    }
  };

  const handleOnPress = async () => {
    try {
      const session = await getStoreData<Models.Session>(storageKeys.session);

      // delete account session on all devices
      await account.deleteSession(session?.$id!);

      // delete session from async storage in local device
      await removeStoredData(storageKeys.session);

      router.replace("/");
    } catch (e: any) {
      console.log(e);
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
      <FlatList
        style={{
          marginTop: 20,
        }}
        data={videos}
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            onRefresh={onRefresh}
            userId={user?.$id!}
            videosRefreshFn={fetchData}
          />
        )}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={() => (
          <NotFound
            title="No video"
            description={`No video create yet!`}
            url="/(tabs)/create"
            btnText="Create video"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh(fetchData)}
          />
        }
        ListHeaderComponent={() => (
          <View>
            <View
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: 30,
              }}
            >
              <TouchableOpacity
                onPress={handleOnPress}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    color: colors.danger[100],
                  }}
                >
                  Leave
                </Text>
                <Ionicons name="log-out" size={25} color={"#db2121"} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image
                source={{ uri: user?.avatar }}
                resizeMode="cover"
                style={{
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: colors.secondary[200],
                  borderRadius: 7,
                }}
              />
            </View>
            <Text
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: sizes.textBold,
                fontWeight: "800",
                color: colors.gray[100],
              }}
            >
              {user?.username}
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 30,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: sizes.textBold,
                  }}
                >
                  {videos.length}
                </Text>
                <Text
                  style={{
                    color: colors.gray[100],
                    fontWeight: "600",
                  }}
                >
                  Videos
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/bookmark")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: sizes.textBold,
                  }}
                >
                  {savedVideosInStorage.length}
                </Text>
                <Text
                  style={{
                    color: colors.gray[100],
                    fontWeight: "600",
                  }}
                >
                  Bookmark
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
