import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Chats from '../components/Chats';
import { launchCamera } from 'react-native-image-picker';

const Chatscreen = () => {
  const [options, setOptions] = useState(['Chats']);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const { token, setToken, setUserId, userId, userName } = useContext(AuthContext); // Add userName to context
  const navigation = useNavigation();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const chatsArrowRotation = useRef(new Animated.Value(0)).current;
  const requestsArrowRotation = useRef(new Animated.Value(0)).current;

  const chooseOption = (option, animatedValue) => {
    if (options.includes(option)) {
      setOptions(options.filter((c) => c !== option));
      animateArrow(animatedValue, 1);
    } else {
      setOptions([...options, option]);
      animateArrow(animatedValue, 0);
    }
  };

  const animateArrow = (animatedValue, toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const logout = () => {
    setLogoutModalVisible(true);
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
      if (token) {
        const decodedToken = jwtDecode(token);
        setToken(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getRequests();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(
        `https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/getrequests/${userId}`
      );
      setRequests(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await axios.post(
        'https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/acceptrequest',
        {
          userId: userId,
          requestId: requestId,
        }
      );

      if (response.status === 200) {
        await getRequests();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        `https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/user/${userId}`
      );
      setChats(response.data);
    } catch (error) {
      console.log('Error Fetching user', error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const cameraGranted = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
        const writeGranted = granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
        const readGranted = granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;

        if (cameraGranted && writeGranted && readGranted) {
          console.log('All permissions granted');
          return true;
        } else {
          console.log('Camera or storage permissions not granted');
          if (!cameraGranted) console.log('Camera permission not granted');
          if (!writeGranted) console.log('Write external storage permission not granted');
          if (!readGranted) console.log('Read external storage permission not granted');
          return false;
        }
      }
      console.log('Permissions granted for iOS');
      return true;
    } catch (err) {
      console.warn('Permission error', err);
      return false;
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { assets } = response;
        const imageUri = assets[0].uri;
        console.log('Image URI:', imageUri);
      }
    });
  };

  const chatsArrowStyle = {
    transform: [
      {
        rotate: chatsArrowRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  const requestsArrowStyle = {
    transform: [
      {
        rotate: requestsArrowRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Pressable>
          <View style={styles.headerIcons}>
            <Pressable onPress={() => navigation.navigate('people')}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/2922/2922510.png',
                }}
              />
              <Text>@{userName || 'User'}</Text> {/* Display the user name */}
            </Pressable>
          </View>
        </Pressable>
        <Text style={styles.headerText}>Chats</Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <MaterialIcons name="camera-alt" size={26} color="#8d4004" onPress={openCamera} />
          <MaterialIcons onPress={logout} name="logout" size={26} color="#8d4004" />
        </View>
      </View>
      <Modal visible={logoutModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={clearAuthToken}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.accordion}>
        <Pressable onPress={() => chooseOption('Chats', chatsArrowRotation)}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Chats</Text>
            <Animated.View style={chatsArrowStyle}>
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#8d4004" />
            </Animated.View>
          </View>
        </Pressable>
        {options.includes('Chats') && <Chats chats={chats} />}
        <Pressable onPress={() => chooseOption('Requests', requestsArrowRotation)}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Requests</Text>
            <Animated.View style={requestsArrowStyle}>
              <MaterialIcons name="keyboard-arrow-right" size={24} color="#8d4004" />
            </Animated.View>
          </View>
        </Pressable>
        {options.includes('Requests') &&
          requests.map((request, index) => (
            <View key={index} style={styles.requestContainer}>
              <Text style={styles.requestText}>{request}</Text>
              <Pressable style={styles.acceptButton} onPress={() => acceptRequest(request)}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </Pressable>
            </View>
          ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#D0C9C0',
    paddingHorizontal: 25,
    paddingVertical: 20,
    gap: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 22,
    color: '#8d4004',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  accordion: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    color: '#8d4004',
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
    color: '#8d4004',
  },
  acceptButton: {
    backgroundColor: '#8d4004',
    padding: 10,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  modalButton: {
    backgroundColor: '#8d4004',
    padding: 10,
    borderRadius: 5,
    width: 60,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
  },
});

export default Chatscreen;
