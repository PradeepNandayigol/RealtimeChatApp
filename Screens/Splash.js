import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Splashsec');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
      <Image 
        source={require('../img/friend.jpg')}
        style={styles.image}
      />
      </View>
      <Text style={styles.text}>Techvant Chats</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#154c79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer:{
    flex: 1,  // Take up available space
    justifyContent: 'center',  // Center image vertically
    alignItems: 'center', 
  },
  image: {
    width: 200, 
    height: 200, 
    marginBottom: 20,
    borderRadius:20
  },
  text: {
   marginBottom:40,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Splash;
