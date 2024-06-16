// import { VideoType } from "@/types";
// import React, { useState } from "react";
// import { FlatList, ViewToken } from "react-native";
// import TrendingVideoItem from "./trending-video-item";

// type TrendingVideosProps = {
//   latestVideos: VideoType[];
// };
// export default function TrendingVideos({ latestVideos }: TrendingVideosProps) {
//   const [activeItem, setActiveItem] = useState(latestVideos[0]);

//   const viewableItemsChanged = ({
//     viewableItems,
//   }: {
//     viewableItems: ViewToken<VideoType>[];
//     changed: ViewToken<VideoType>[];
//   }) => {
//     if (viewableItems.length > 0) {
//       console.log(viewableItems[0].item.title);

//       setActiveItem(viewableItems[0].item);
//     }
//   };
//   return (
//     <FlatList
//       data={latestVideos}
//       keyExtractor={(item) => item.documentId}
//       renderItem={({ item }) => (
//         <TrendingVideoItem item={item} activeItem={activeItem} />
//       )}
//       horizontal
//       onViewableItemsChanged={viewableItemsChanged}
//       viewabilityConfig={{
//         itemVisiblePercentThreshold: 70,
//       }}
//       contentOffset={{ x: 100, y: 0 }}
//     />
//   );
// }

import { VideoType } from "@/types";
import React, { useState, useRef } from "react";
import {
  FlatList,
  ViewToken,
  ViewabilityConfigCallbackPairs,
} from "react-native";
import TrendingVideoItem from "./trending-video-item";

type TrendingVideosProps = {
  latestVideos: VideoType[];
};

export default function TrendingVideos({ latestVideos }: TrendingVideosProps) {
  const [activeItem, setActiveItem] = useState(latestVideos[0]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        console.log(viewableItems[0].item.title);
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

  return (
    <FlatList
      data={latestVideos}
      keyExtractor={(item) => item.documentId}
      renderItem={({ item }) => (
        <TrendingVideoItem item={item} activeItem={activeItem} />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      contentOffset={{ x: 100, y: 0 }}
    />
  );
}
