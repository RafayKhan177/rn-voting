import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import firebase from "../../firebase";
import { colors } from "../../constants";
import ScreenHeading from "../../components/ScreenHading";

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersCollection = firebase.firestore().collection("users");
    const unsubscribe = usersCollection.onSnapshot((querySnapshot) => {
      const userData = [];
      querySnapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(userData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUserPress = (user) => {
    navigation.navigate("ManageUsersDetailsScreen", { user });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.userContainer}>
        <Text style={styles.userName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.email}>Email: {item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeading txt="Users List" />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false} // Remove the scrollbar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  flatListContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  userContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.backgroundAccent,
    // shadowColor: colors.backgroundAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default ManageUsers;
