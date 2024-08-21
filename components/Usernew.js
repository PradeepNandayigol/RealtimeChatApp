import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

const Usernew = ({ item }) => {
    const navigation = useNavigation();
  return (
    <View style={styles.userContainer}>
      <Pressable>
        <Image source={{ uri: item?.image }} style={styles.userImage} />
      </Pressable>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item?.name}</Text>
        <Text style={styles.userEmail}>{item?.email}</Text>
      </View>
      <Pressable onPress={() => navigation.navigate("Request", {
        name: item?.name,
        receiverId: item?._id,
      })} style={styles.chatButton}>
        <Text style={styles.chatButtonText}>Chat</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  chatButton: {
    padding: 10,
    width: 60,
    backgroundColor: '#005187',
    borderRadius: 4,
  },
  chatButtonText: {
    textAlign: 'center',
    color: 'white',
  },
});

export default Usernew;
