import { Image, ImageBackground, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigation.replace('MainStack', { screen: 'Main' });
    }
  }, [token, navigation]);

  const handlelogin = async () => {
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post('https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/login', user);
      const token = response.data.token;
      await AsyncStorage.setItem("authToken", token);
      setToken(token);
    } catch (error) {
      console.error("Error logging in:", error);
      // Add any additional error handling logic here, like showing an error message to the user
    }
  };

  // const backgroundImage = require('../img/img2.png');

  return (

    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        {/* <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        > */}
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.loginText}>Login to your account</Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <View>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#bebebe"
                style={styles.input}
                placeholder="Enter your email"
              />
            </View>
            <View>
              <Text style={[styles.inputLabel, { marginTop: 25 }]}>Password</Text>
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#bebebe"
                style={styles.input}
                placeholder="Enter your Password"
              />
            </View>

            <Pressable
              onPress={handlelogin}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
            <Pressable>
              <Text
                onPress={() => navigation.navigate("Register")}
                style={styles.signUpText}
              >
                Don't have an account? <Text style={{color:'#1685b2',fontWeight:'500'}}>Sign Up</Text>
              </Text>
            </Pressable>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={styles.logoImage}
              source={require('../img/img2.png')}
            />
          </View>
        {/* </ImageBackground> */}
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginTop: 80,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'gray',
  },
  input: {
    width: 320,
    marginTop: 15,
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    color: 'black',
    paddingBottom: 10,
    fontFamily: 'GeezaPro-Bold',
    fontSize: 15,
  },
  loginButton: {
    width: 200,
    backgroundColor: '#4a55a2',
    padding: 10,
    marginTop: 50,
    alignSelf: 'center',
    borderRadius: 6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    margin: 12,
  },
  logoImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

