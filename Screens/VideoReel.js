// VideoReel.js

import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import Video from 'react-native-video';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const videos = [
  { id: '1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Big Buck Bunny' },
  { id: '2', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Sample Movie' },
  { id: '3', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Big Buck Bunny 2' },
  { id: '4', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Sample Movie 2' },
  { id: '5', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Big Buck Bunny 3' },
  { id: '6', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Sample Movie 3' },
  { id: '7', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Big Buck Bunny 4' },
  { id: '8', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Sample Movie 4' },
  { id: '9', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Big Buck Bunny 5' },
  { id: '10', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Sample Movie 5' },
  { id: '11', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Big Buck Bunny 6' },
  { id: '12', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Sample Movie 6' },
];

const VideoReel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: item.url }}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={currentIndex !== index}
      />
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VideoReel;
