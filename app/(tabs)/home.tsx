import NotFound from "@/components/not-found";
import SearchInput from "@/components/search-input";
import TrendingVideos from "@/components/trending-videos";
import VideoCard from "@/components/video-card";
import { images } from "@/constants";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import useShowErrorAlert from "@/hooks/show-error-alert";
import useFetchListData from "@/hooks/useFetchListData";
import {
  getAllVideos,
  getLatestVideos,
  getSignInUser,
  getUser,
} from "@/lib/appwrite";
import { UserType, VideoType } from "@/types";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Models } from "react-native-appwrite";

export default function HomeScreen() {
  const showAlert = useShowErrorAlert();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [signInUser, setSignInUser] =
    useState<Models.User<Models.Preferences>>();
  const [currentUser, setCurrentUser] = useState<UserType>();

  const { data: latestVideos, refreshFn: latestVideosRefreshFn } =
    useFetchListData({
      fn: getLatestVideos,
    });
  const { data: videos, refreshFn: videosRefreshFn } = useFetchListData({
    fn: getAllVideos,
  });

  const onRefresh = useCallback(async (fn: () => Promise<void>) => {
    setIsRefreshing(true);
    await fn();
    setIsRefreshing(false);
  }, []);

  // fetch user information
  useEffect(() => {
    const fetchData = async () => {
      try {
        const singInUserData = await getSignInUser();

        setSignInUser(singInUserData);
        const user = await getUser(singInUserData.$id);
        setCurrentUser(user);
      } catch (e: any) {
        showAlert({
          message: "Error when fetching user information",
        });
      }
    };

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
        data={videos}
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            userId={currentUser?.accountId!}
            onRefresh={onRefresh}
            videosRefreshFn={videosRefreshFn}
          />
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              marginVertical: 30,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.gray[100],
                    fontSize: sizes.text,
                    fontWeight: "600",
                  }}
                >
                  Welcome back,
                </Text>
                <Text
                  style={{
                    color: colors.gray[100],
                    fontSize: sizes.headerTiny,
                    fontWeight: "900",
                  }}
                >
                  {signInUser?.name}
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View
              style={{
                width: "100%",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: colors.gray[100],
                  fontSize: sizes.text,
                  fontWeight: "600",
                  marginTop: 10,
                  marginBottom: 7,
                }}
              >
                Latest videos
              </Text>
              <TrendingVideos
                latestVideosRefreshFn={latestVideosRefreshFn}
                latestVideos={latestVideos as VideoType[]}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <NotFound
            title="No video found"
            description="No video created yet! You can be first creator. Create your video!"
            btnText="Create video"
            url="/(tabs)/create"
          />
        )}
        keyExtractor={(item) => item.$id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh(videosRefreshFn)}
          />
        }
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
