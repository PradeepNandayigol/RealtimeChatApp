import React, { useContext, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Chats from '../components/Chats';

const Chatscreen = () => {
  const [options, setOptions] = useState(['Chats']);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const { token, setToken, setUserId, userId } = useContext(AuthContext);
  const navigation = useNavigation();

  const chooseOption = option => {
    if (options.includes(option)) {
      setOptions(options.filter(c => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };

  const logout = () => {
    clearAuthToken();
  };

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken('');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      setToken(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(
        `https://795f-106-213-83-207.ngrok-free.app/getrequests/${userId}`,
      );
      setRequests(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  const acceptRequest = async requestId => {
    try {
      const response = await axios.post("https://795f-106-213-83-207.ngrok-free.app/acceptrequest", {
        userId: userId,
        requestId: requestId
      });

      if (response.status == 200) {
        await getRequests();
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const getUser = async () => {
    try {
      const response = await axios.get(`https://795f-106-213-83-207.ngrok-free.app/user/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.log("Error Fetching user", error);
      throw error
    }
  }
  console.log("usettrs", chats)
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Pressable>
          <MaterialIcons onPress={logout} name='logout' size={26} color='black' />
        </Pressable>
        <Text style={styles.headerText}>Chats</Text>
        <View>
          <View style={styles.headerIcons}>
            <MaterialIcons name="camera-alt" size={26} color="black" />
            <Pressable onPress={() => navigation.navigate('people')}>
              <Image
                style={styles.profileImage}
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2922/2922510.png' }}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.optionContainer}>
        <Pressable
          onPress={() => chooseOption('Chats')}
          style={styles.optionPressable}>
          <View>
            <Text style={styles.optionText}>Chats</Text>
          </View>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </Pressable>
        <View>
          {options?.includes('Chats') &&
            (chats?.length > 0 ? (
              <View>
                {chats?.map((item, index)=>{
                  <Chats item={item} key={item?._id} />
                })}
              </View>
            ) : (
              <View style={styles.noChatsContainer}>
                <View>
                  <Text style={styles.noChatsText}>No chats yet</Text>
                  <Text style={styles.noChatsText}>Chat by messaging a friend</Text>
                </View>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.optionContainer}>
        <Pressable
          onPress={() => chooseOption('Requests')}
          style={styles.optionPressable}>
          <View>
            <Text style={styles.optionText}>Requests</Text>
          </View>
          <MaterialIcons name="arrow-drop-down" size={24} color="black" />
        </Pressable>
        <View style={styles.requestsContainer}>
          {options.includes('Requests') && (
            <View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: 'gray' }}>Check out all Requests</Text>
              {requests.map((item, index) => (
                <Pressable key={index}>
                  <ScrollView>
                    <View style={styles.requestItem}>
                      <Pressable>
                        <Image source={{ uri: item?.from?.image }} style={styles.requestImage} />
                      </Pressable>
                      <View style={styles.requestTextContainer}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: 'black' }}>{item?.from?.name}</Text>
                        <Text style={{ marginTop: 4, color: 'gray' }}>{item?.message}</Text>
                      </View>
                      <Pressable onPress={() => {
                        acceptRequest(item?.from?._id)
                      }} style={{ padding: 8, backgroundColor: '#005187', width: 75, borderRadius: 5 }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, alignItems: 'center', color: 'white' }}>Accept</Text>
                      </Pressable>
                      <MaterialIcons name='delete' size={26} color='red' />
                    </View>
                  </ScrollView>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  optionContainer: {
    padding: 10,
  },
  optionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: 'black',
  },
  noChatsContainer: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    textAlign: 'center',
    color: 'gray',
  },
  requestsContainer: {
    marginVertical: 12,
  },
  requestsHeaderText: {
    color: 'black',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 5,
  },
  requestImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requestTextContainer: {
    flex: 1,
  },
  requestName: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
  },
  requestMessage: {
    color: 'black',
  },
  acceptButton: {
    color: 'blue',
  },
});
