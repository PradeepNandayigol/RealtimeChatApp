import { Alert, Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  const handleregister = async () => {
    const user = {
      name,
      email,
      password,
      image,
    };
    
    try {
      const response = await axios.post('https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/register', user);

      console.log(response.data);
      Alert.alert(
        'Registration Successful',
        'You have been registered successfully!',
      );
      setName("");
      setEmail("");
      setPassword("");
      setImage("");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Error", "An error occurred while registering. Please try again.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
        <View style={{ padding: 10, alignItems: 'center' }}>
          <View style={{ marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '500', color: 'black' }}>Set up your Profile</Text>
            <Text style={{ marginTop: 10, color: 'gray', textAlign: 'center', marginHorizontal: 12 }}>Profiles are visible to your friends and connection and groups</Text>
            <Pressable style={{ marginTop: 20 }}>
              <Image source={{ uri: image || "https://cdn-icons-png.flaticon.com/128/149/149071.png" }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <Text style={{ textAlign: 'center', marginTop: 4, color: 'gray', fontSize: 12 }}>Add</Text>
            </Pressable>
          </View>
          <View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginTop: 15 }}>Name</Text>
              <View>
                <TextInput
                  value={name} onChangeText={setName}
                  placeholderTextColor="#bebebe"
                  style={styles.input}
                  placeholder="Enter your Name"
                />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginTop: 15 }}>Email</Text>
              <View>
                <TextInput
                  value={email} onChangeText={setEmail}
                  placeholderTextColor="#bebebe"
                  style={styles.input}
                  placeholder="Enter your email"
                />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginTop: 15 }}>Password</Text>
              <View>
                <TextInput
                  secureTextEntry={true}
                  value={password} onChangeText={setPassword}
                  placeholderTextColor="#bebebe"
                  style={styles.input}
                  placeholder="Enter your Password"
                />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray', marginTop: 15 }}>Image</Text>
              <View>
                <TextInput
                  value={image} onChangeText={setImage}
                  placeholderTextColor="#bebebe"
                  style={styles.input}
                  placeholder="Enter your Image URL"
                />
              </View>
            </View>

            <Pressable onPress={handleregister} style={styles.registerButton}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Register</Text>
            </Pressable>
            <Pressable>
              <Text onPress={() => navigation.navigate("Login")}
                style={{ textAlign: 'center', color: 'gray', fontSize: 16, margin: 12 }}>Already have an account? <Text style={{color:'#1685b2', fontWeight:'500'}}>Sign In</Text></Text>
            </Pressable>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  input: {
    width: 320,
    color:'black',
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    paddingBottom: 10,
    fontFamily: 'GeezaPro-Bold',
    fontSize: 15
  },
  registerButton: {
    width: 200,
    backgroundColor: '#4a55a2',
    padding: 10,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 6,
  }
});
