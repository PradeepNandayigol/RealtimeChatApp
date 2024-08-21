import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Pressable,
    StyleSheet,
    ImageBackground,
    Image
} from 'react-native';
import React, { useContext, useEffect, useState, useLayoutEffect } from 'react'; // Add useLayoutEffect import
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useSocketContext } from '../SocketContext';

const Chatroom = () => {
    const navigation = useNavigation();
    const { socket } = useSocketContext();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const { token, userId } = useContext(AuthContext);
    const route = useRoute();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Ensures space between elements // Add padding if needed
                    }}
                >
                    <MaterialIcons
                        onPress={() => navigation.goBack()}
                        name="arrow-back"
                        size={24}
                        color="black"
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 20 }}>
                        <Image
                            source={{ uri: route?.params?.image }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />

                        <Text style={{ fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 25 }}>
                            {route?.params?.name}
                        </Text>
                    </View>

                    <MaterialIcons style={{ marginRight: 20 }} name="more-vert" size={24} color="black" />
                </View>

            )
        });
    }, [navigation, route?.params?.name]);

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            newMessage.shouldShake = true;
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        socket?.on('newMessage', handleNewMessage);
        return () => socket?.off('newMessage', handleNewMessage);
    }, [socket]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const senderId = userId;
                const receiverId = route?.params?.receiverId;

                const response = await axios.get('https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/messages', {
                    params: { senderId, receiverId }
                });
                setMessages(response.data);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchMessages();
    }, [route.params.receiverId, userId]);

    const sendMessage = async (senderId, receiverId) => {
        try {
            await axios.post('https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/sendMessage', {
                senderId,
                receiverId,
                message
            });
            socket.emit('sendMessage', { senderId, receiverId, message });

            setMessage("");
        } catch (error) {
            console.log("Error", error);
        }
    };

    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };
    const backgroundImage = require('../img/img.png');

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground
                source={backgroundImage}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                    {messages?.map((item, index) => (
                        <Pressable key={index} style={[
                            item?.senderId?._id === userId ? styles.userMessage : styles.otherMessage
                        ]}>
                            <Text style={{ fontSize: 13, textAlign: 'left', color: 'black' }}>{item?.message}</Text>
                            <Text style={{ textAlign: 'right', fontSize: 9, color: 'gray' }}>{formatTime(item?.timeStamp)}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </ImageBackground>
            <View style={styles.inputContainer}>
                <MaterialIcons name="mood" size={24} color="#0066b2" style={styles.icon} />
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    style={styles.textInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                />
                <View style={styles.iconContainer}>
                    <MaterialIcons name="camera-alt" size={24} color="#8d4004" style={styles.icon} />
                    <MaterialIcons name="mic" size={24} color="#b38000" style={styles.icon} />
                </View>
                <Pressable
                    onPress={() => sendMessage(userId, route?.params?.receiverId)}
                    style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
    },
    textInput: {
        flex: 1,
        color: 'black',
        height: 40,
        borderWidth: 1,
        marginLeft: 10,
        borderRadius: 20,
        paddingHorizontal: 10,
        borderColor: '#dddddd',
    },
    icon: {
        marginHorizontal: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    sendButton: {
        backgroundColor: '#0066b2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    sendButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    userMessage: { // For user's own messages
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        padding: 8,
        maxWidth: '60%',
        borderRadius: 7,
        margin: 10
    },
    otherMessage: { // For other user's messages
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        padding: 8,
        maxWidth: '60%',
        borderRadius: 7,
        margin: 10
    }
});

export default Chatroom;
