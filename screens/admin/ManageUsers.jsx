import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import firebase from "../../firebase";

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Add a real-time listener to the users collection
    const usersCollection = firebase.firestore().collection("users");
    const unsubscribe = usersCollection.onSnapshot((querySnapshot) => {
      const userData = [];
      querySnapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(userData);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUserPress = (user) => {
    navigation.navigate("ManageUsersDetailsScreen", { user });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.userContainer}>
              <Text>
                {item.firstName} {item.lastName}
              </Text>
              <Text>Email: {item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
  },
});

export default UsersList;
