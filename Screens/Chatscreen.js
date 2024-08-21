import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  PermissionsAndroid, // Import PermissionsAndroid
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
  const { token, setToken, setUserId, userId } = useContext(AuthContext);
  const navigation = useNavigation();

  // State to control the visibility of the logout confirmation modal
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Animated values for arrow rotation
  const chatsArrowRotation = useRef(new Animated.Value(0)).current;
  const requestsArrowRotation = useRef(new Animated.Value(0)).current;

  const chooseOption = (option, animatedValue) => {
    if (options.includes(option)) {
      setOptions(options.filter((c) => c !== option));
      animateArrow(animatedValue, 1); // Rotate back to initial position
    } else {
      setOptions([...options, option]);
      animateArrow(animatedValue, 0); // Rotate to open position
    }
  };

  const animateArrow = (animatedValue, toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 200, // Duration of animation
      useNativeDriver: true,
    }).start();
  };

  const logout = () => {
    // Show the logout confirmation modal
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

  // Function to request camera and storage permissions
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
      return true; // For iOS, permissions are handled automatically
    } catch (err) {
      console.warn('Permission error', err);
      return false;
    }
  };

  // Function to launch the camera
  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const options = {
      mediaType: 'photo', // Only allow photo capture
      cameraType: 'back', // Use the back camera
      saveToPhotos: true, // Save the captured photo to the device's photo library
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
        // Handle the captured image here
      }
    });
  };

  // Interpolated rotation styles
  const chatsArrowStyle = {
    transform: [
      {
        rotate: chatsArrowRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'], // Rotate 90 degrees when open
        }),
      },
    ],
  };

  const requestsArrowStyle = {
    transform: [
      {
        rotate: requestsArrowRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'], // Rotate 90 degrees when open
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
                  uri: 'data:image/png;base64,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',
                }}
              />
             
            </Pressable>
          </View>
        </Pressable>
        <Text style={styles.headerText}>Chats</Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {/* Use the openCamera function here */}
          <MaterialIcons name="camera-alt" size={26} color="#8d4004" onPress={openCamera} />
          <MaterialIcons onPress={logout} name="logout" size={26} color="#F44336" />
        </View>
      </View>
      <View style={styles.optionContainer}>
        <Pressable
          onPress={() => chooseOption('Chats', chatsArrowRotation)}
          style={styles.optionPressable}
        >
          <View>
            <Text style={styles.optionText}>Chats</Text>
          </View>
          <Animated.View style={chatsArrowStyle}>
            <MaterialIcons name="arrow-drop-down" size={30} color="#4682b4" />
          </Animated.View>
        </Pressable>
        <View>
          {options.includes('Chats') &&
            (chats.length > 0 ? (
              <View>
                {chats.map((item, index) => (
                  <Chats item={item} key={`${item._id}-${index}`} />
                ))}
              </View>
            ) : (
              <View style={styles.noChatsContainer}>
                <Text style={styles.noChatsText}>
                  Chat by messaging a friend
                </Text>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.optionContainer}>
        <Pressable
          onPress={() => chooseOption('Requests', requestsArrowRotation)}
          style={styles.optionPressable}
        >
          <View>
            <Text style={styles.optionText}>Requests</Text>
          </View>
          <Animated.View style={requestsArrowStyle}>
            <MaterialIcons name="arrow-drop-down" size={30} color="#4682b4" />
          </Animated.View>
        </Pressable>
        <View style={styles.requestsContainer}>
          {options.includes('Requests') && (
            <View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: 'gray' }}>
                Check out all Requests
              </Text>
              {requests.map((item, index) => (
                <View key={index} style={styles.requestItem}>
                  <Pressable>
                    <Image
                      source={{ uri: item?.from?.image }}
                      style={styles.requestImage}
                    />
                  </Pressable>
                  <View style={styles.requestTextContainer}>
                    <Text
                      style={{ fontSize: 15, fontWeight: '600', color: 'black' }}
                    >
                      {item?.from?.name}
                    </Text>
                    <Text style={{ marginTop: 4, color: 'gray' }}>
                      {item?.message}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => acceptRequest(item?.from?._id)}
                    style={{
                      padding: 8,
                      backgroundColor: '#005187',
                      width: 75,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 13,
                        color: 'white',
                      }}
                    >
                      Accept
                    </Text>
                  </Pressable>
                  <MaterialIcons name="delete" size={26} color="red" />
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center',}} >
        <Image
                style={{width:250,height:250,}}
                source={require('../img/chatimg.png')}
              />
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => {
          setLogoutModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setLogoutModalVisible(false);
                  clearAuthToken();
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Chatscreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 25,
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
    paddingHorizontal: 25,
  },
  optionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: 'black',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    color: 'black',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#005187',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
