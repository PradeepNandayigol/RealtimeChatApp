import { View, Text, Pressable, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../AuthContext';

const Chats = ({ item }) => {
    const navigation = useNavigation();
    const { userId } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    return (
        <Pressable
        onPress={() =>{
            navigation.navigate('Chatroom',{
                name: item?.name,
                receiverId: item?._id,
                image:item?.image
            })
        }}
        style={{marginVertical:15}} >
            <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                <Pressable>
                    <Image source={{ uri: item?.image }} style={{ width:40, height:40, borderRadius:20 }} />
                </Pressable>
                <View>
                    <Text style={{fontSize:15, fontWeight:'500', color:'black'}}>{ item?.name }</Text>
                    <Text style={{marginTop:4, color:'gray'}}> chat with{ item?.name  } </Text>
                </View>
            </View>
        </Pressable>
    )
}

export default Chats