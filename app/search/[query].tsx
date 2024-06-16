import NotFound from "@/components/not-found";
import SearchInput from "@/components/search-input";
import VideoCard from "@/components/video-card";
import { colors } from "@/constants/colors";
import { sizes } from "@/constants/sizes";
import { defaultStyles } from "@/constants/styles";
import useFetchListData from "@/hooks/useFetchListData";
import { searchVideosByTitle } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";

export default function SearchScreen() {
  const navigation = useNavigation();
  const { query } = useLocalSearchParams<{
    query: string;
  }>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data: videos, refreshFn: videosRefreshFn } = useFetchListData({
    fn: () => searchVideosByTitle(query!),
  });

  const onRefresh = useCallback(async (fn: () => Promise<void>) => {
    setIsRefreshing(true);
    await fn();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ionicons name="arrow-back" size={25} color={colors.gray[100]} />
          <Text
            style={{
              color: colors.gray[100],
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      ),
    });
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
          color: colors.gray[100],
          fontSize: sizes.textBold,
        }}
      >
        Search results: {query}
      </Text>
      <SearchInput query={query} />
      <FlatList
        style={{
          marginTop: 20,
        }}
        data={videos}
        renderItem={({ item }) => <VideoCard item={item} />}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={() => (
          <NotFound
            title="No video found"
            description={`No video with the title ${query}`}
            url="/(tabs)/home"
            btnText="Back to Home"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh(videosRefreshFn)}
          />
        }
      />
    </SafeAreaView>
  );
}
