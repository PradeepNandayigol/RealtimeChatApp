import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chatscreen from '../Screens/Chatscreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Profilescreen from '../Screens/Profilescreen';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import People from '../Screens/People';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import RequestChatRoom from '../Screens/RequestChatRoom';
import Chatroom from '../Screens/Chatroom';
import Splash from '../Screens/Splash';
import Splashsec from '../Screens/Splashsec';
import VideoReel from '../Screens/VideoReel';
import Home from '../Screens/Home';
const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    const { token, setToken } = useContext(AuthContext);
    function BottomTabs() {
        return (
            <Tab.Navigator 
            screenOptions={{
                tabBarStyle: { 
                    backgroundColor: '#4a55a2',
                    paddingBottom: 10, // Add padding to the bottom of the tab bar
                    height: 70, // Adjust height if necessary to accommodate padding
                },
            }} >
                 <Tab.Screen name="Home"
                    component={Home}
                    options={{
                        tabBarStyle: { backgroundColor: '#4a55a2',paddingBottom:10,color:'white' },
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <MaterialIcons name="home" size={30} color="#989898" />
                            ) : (<MaterialIcons name="home" size={30} color="white" />),
                    }}
                />
                <Tab.Screen name="Chats"
                    component={Chatscreen}
                    options={{
                        tabBarStyle: { backgroundColor: '#4a55a2',paddingBottom:10,color:'white' },
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <MaterialIcons name="chat-bubble-outline" size={30} color="#989898" />
                            ) : (<MaterialIcons name="chat-bubble-outline" size={30} color="white" />),
                    }}
                />
                 <Tab.Screen name="Reels"
                    component={VideoReel}
                    options={{
                        tabBarStyle: { backgroundColor: '#4a55a2',paddingBottom:10,color:'white' },
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <MaterialIcons name="movie" size={30} color="#989898" />
                            ) : (<MaterialIcons name="movie" size={30} color="white" />),
                    }}
                />
                <Tab.Screen name="Profile"
                    component={Profilescreen}
                    options={{
                        tabBarStyle: { backgroundColor: '#4a55a2' },
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <MaterialIcons name="person-outline" size={30} color="#989898" />
                            ) : (<MaterialIcons name="person-outline" size={30} color="white" />),
                    }}
                />
            </Tab.Navigator>
        );
    }

    const AuthStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Splashsec"
                    component={Splashsec}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        );
    };

    function MainStack() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name='Main'
                    component={BottomTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='people'
                    component={People}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Request'
                    component={RequestChatRoom}
                    />
                 <Stack.Screen
                    name='Chatroom'
                    component={Chatroom}
                    />   
            </Stack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            {token === null || token === '' ? <AuthStack /> : <MainStack />}
        </NavigationContainer>
    )
}

export default StackNavigator;

const styles = StyleSheet.create({})
