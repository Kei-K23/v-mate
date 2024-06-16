import { VideoType } from "@/types";
import React, { useState, useRef, useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  ViewToken,
  ViewabilityConfigCallbackPairs,
} from "react-native";
import TrendingVideoItem from "./trending-video-item";

type TrendingVideosProps = {
  latestVideos: VideoType[];
  latestVideosRefreshFn: () => Promise<void>;
};

export default function TrendingVideos({
  latestVideos,
  latestVideosRefreshFn,
}: TrendingVideosProps) {
  const [activeItem, setActiveItem] = useState(latestVideos[0]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].item);
      }
    }
  );

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>(
    [
      {
        viewabilityConfig: viewabilityConfig.current,
        onViewableItemsChanged: onViewableItemsChanged.current,
      },
    ]
  );

  const onRefresh = useCallback(async (fn: () => Promise<void>) => {
    setIsRefreshing(true);
    await fn();
    setIsRefreshing(false);
  }, []);

  return (
    <FlatList
      data={latestVideos}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingVideoItem item={item} activeItem={activeItem} />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      contentOffset={{ x: 100, y: 0 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => onRefresh(latestVideosRefreshFn)}
        />
      }
    />
  );
}
