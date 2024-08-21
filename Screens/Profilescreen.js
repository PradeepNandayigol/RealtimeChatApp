import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InstaStory from 'react-native-insta-story'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Profilescreen = ({navigation}) => {

  const channels = [
    {
      id: '0',
      name: ' Virat Kohli ',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAtic4zkoYA0BmKDTREcuxL0VWVMlP3UqBUg&s',
      text: 'Any guesses who won the Fielding medal for the series',
      date: '1:45 PM',
    },
    {
      id: '5',
      name: 'Royal Challengers Bangalore',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDlVuzjh0-kKm1BbO5qBjeIwelK8r4DvYZ5A&s',
      text: 'We only want it to rain boundaries and wickets for RCB',
      date: '2:45 AM',
    },

    {
      id: '2',
      name: 'Marc Zuckerberg',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHtsQvDUZ3Q90XuFjYvcZ-KVaDhUJcA39u-g&s',
      text: 'Anyone else watching this weekend?',
      date: '2:45 AM',
    },
    {
      id: '0',
      name: 'Netflix',
      image: 'https://cdn-icons-png.flaticon.com/128/2504/2504929.png',
      text: 'Your in the right place',
      date: '2:45 AM',
    },
  ];
  const data = [
    {
      user_id: 1,
      user_image:
        'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
      user_name: 'Ahmet Çağlar Durmuş',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
          swipeText: 'Explore the universe!',
          onPress: () => console.log('User 1, Story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
          swipeText: 'Dive into fluid shapes!',
          onPress: () => console.log('User 1, Story 2 swiped'),
        },
      ],
    },
    {
      user_id: 2,
      user_image:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: 'Test User',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Adventure awaits!',
          onPress: () => console.log('User 2, Story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
          swipeText: 'Swipe to see more!',
          onPress: () => console.log('User 2, Story 2 swiped'),
        },
      ],
    },
    {
      user_id: 3,
      user_image:
        'https://randomuser.me/api/portraits/men/32.jpg',
      user_name: 'John Doe',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg',
          swipeText: 'Nature at its best!',
          onPress: () => console.log('User 3, Story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg',
          swipeText: 'City lights!',
          onPress: () => console.log('User 3, Story 2 swiped'),
        },
        {
          story_id: 3,
          story_image:
            'https://images.pexels.com/photos/1040245/pexels-photo-1040245.jpeg',
          swipeText: 'Artistic vibe!',
          onPress: () => console.log('User 3, Story 3 swiped'),
        },
      ],
    },
    {
      user_id: 4,
      user_image:
        'https://randomuser.me/api/portraits/women/44.jpg',
      user_name: 'Jane Smith',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
          swipeText: 'Beach time!',
          onPress: () => console.log('User 4, Story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
          swipeText: 'Mountains ahead!',
          onPress: () => console.log('User 4, Story 2 swiped'),
        },
      ],
    },
    {
      user_id: 5,
      user_image:
        'https://randomuser.me/api/portraits/men/85.jpg',
      user_name: 'Mike Brown',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg',
          swipeText: 'Architectural marvels!',
          onPress: () => console.log('User 5, Story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg',
          swipeText: 'Wildlife wonders!',
          onPress: () => console.log('User 5, Story 2 swiped'),
        },
        {
          story_id: 3,
          story_image:
            'https://images.pexels.com/photos/2531649/pexels-photo-2531649.jpeg',
          swipeText: 'Starry night!',
          onPress: () => console.log('User 5, Story 3 swiped'),
        },
      ],
    },
    {
      user_id: 6,
      user_image:
        'https://randomuser.me/api/portraits/women/95.jpg',
      user_name: 'Emma Wilson',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          swipeText: 'Serene landscape!',
          onPress: () => console.log('User 6, Story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg',
          swipeText: 'Underwater world!',
          onPress: () => console.log('User 6, Story 2 swiped'),
        },
      ],
    },
  ];
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.updatesContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical:15, paddingBottom:30 }}>
          <MaterialIcons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Text style={{ flex: 1, fontSize: 19, fontWeight: 'bold', textAlign: 'center', color:'black' }}>Stories</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.headerText}>Updates</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.updatesScroll}>
            <Pressable style={{borderRightWidth:1, borderRightColor:'gray', marginTop:-15}}>
              <Image
                style={styles.updateImage}
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2922/2922510.png' }}
              />
            </Pressable>
            <InstaStory data={data} duration={10} />
          </View>
        </ScrollView>
      </View>
      <View style={styles.channelsContainer}>
        <Text style={styles.channelsHeader}>Channels</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {channels.map((item, index) => (
            <View key={index} style={styles.channelItem}>
              <Image
                style={styles.channelImage}
                source={{ uri: item.image }}
              />
              <View style={styles.channelTextContainer}>
                <Text style={styles.channelName}>
                  {item.name}
                </Text>
                <Text style={styles.channelText}>{item.text}</Text>
              </View>
              <Text style={styles.channelDate}>{item.date}</Text>
            </View>
          ))}
          <View style={styles.stickerContainer}>
            <Image
              style={styles.stickerImage}
              source={{
                uri: 'https://signal.org/assets/images/features/Stickers.png',
              }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Profilescreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10
  },
  updatesContainer: {
    padding: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color:'gray'
  },
  updatesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  updateImage: {
    width: 62,
    height: 62,
    borderRadius: 29,
    borderWidth:2,
    borderColor:'#4a55a2',
    marginRight: 10,
   
  },
  channelsContainer: {
    flex: 1,
    padding: 10,
  },
  channelsHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'gray'
  },
  channelItem: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    
  },
  channelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  channelTextContainer: {
    flex: 1,
  },
  channelName: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'gray'
  },
  channelText: {
    marginTop: 4,
    color: 'gray',
  },
  channelDate: {
    color: 'gray',
  },
  stickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  stickerImage: {
    width: 120,
    height: 120,
  },
});
