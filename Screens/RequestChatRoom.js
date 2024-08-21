import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';


const RequestChatRoom = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const { token, userId, setToken, setUserId } = useContext(AuthContext);
    const route = useRoute();
    useLayoutEffect(() => {
        return navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignContent: 'center', gap: 10 }}>
                    <Icon onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />
                    <View>
                        <Text style={{ color: 'gray',paddingLeft:30, fontSize:20, fontWeight:'600' }}>{route?.params?.name}</Text>
                    </View >
                </View>
            )
        })
    }, []);

    const sendMessage = async () => {
        try {
            const userData = {
                senderId:userId,
                receiverId:route?.params?.receiverId,
                message:message,
            };
            const response = await axios.post("https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/sendrequest", userData);
            if(response.status == 200){
                setMessage("");
                Alert.alert("your request has been sent","wait for user accept your request")
            }
            
        } catch (error) {
            console.log("error", error)
            
        }
    }
    return (
        <KeyboardAvoidingView style={{flex:1, backgroundColor:'white'}}>
            <ScrollView></ScrollView>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#dddddd', marginBottom: 20 }}>
                <Icon name="mood" size={24} color="#0066b2" style={styles.icon} />
                <TextInput value={message} onChangeText={setMessage} style={{ flex: 1,color:'black', height: 40,borderWidth:1,marginLeft:10, borderRadius: 20, paddingHorizontal: 10, borderColor: '#ddddd' }} />
                <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginHorizontal: 8,
            }}>
                <Icon name="camera-alt" size={24} color="#8d4004" style={styles.icon} />
                <Icon name="mic" size={24} color="#b38000" style={styles.icon} />
            </View>
            <Pressable
                onPress={sendMessage}
                style={{
                    backgroundColor: '#0066b2',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20
                }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Send</Text>

            </Pressable>
            </View>
            
        </KeyboardAvoidingView>

    )
}

export default RequestChatRoom

const styles = StyleSheet.create({})