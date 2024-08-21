import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Usernew from '../components/Usernew'; // Ensure the import path is correct
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const People = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userId } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`https://aefc-2401-4900-1c9a-806b-acde-4419-fe58-f02a.ngrok-free.app/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical:15,
          paddingBottom:25,
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
          <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', marginLeft: 25 }}>
            Friend Suggetions
          </Text>
        </View>

        <MaterialIcons style={{ marginRight: 10 }} name="more-vert" size={24} color="black" />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : users.length === 0 ? (
        <Text style={styles.noUsersText}>No users found</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <Usernew item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default People;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
    color: 'red',
  },
  noUsersText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: 'gray',
  },
});
