import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import firebase from "../../firebase";

const UserDetails = ({ route, navigation }) => {
  const { user } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const usersCollection = firebase.firestore().collection("users");
      await usersCollection.doc(user.id).update(editedUser); // Use user.id to identify the user in Firestore
      setIsEditing(false);
      navigation.push("ManageUsersScreen");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Role: {user.role}</Text>
      <Text>First Name: {user.firstName}</Text>
      <Text>Last Name: {user.lastName}</Text>
      <Text>House Color: {user.houseColor}</Text>
      <Text>Class: {user.class}</Text>
      <Text>Email: {user.email}</Text>
      <Text>First Password: {user.firstPassword}</Text>

      {!isEditing ? (
        <TouchableOpacity onPress={handleEditPress}>
          <View style={styles.button}>
            <Text>Edit</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Modal visible={isEditing} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              value={editedUser.role}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, role: text })
              }
              placeholder="Role"
            />
            <TextInput
              style={styles.input}
              value={editedUser.firstName}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, firstName: text })
              }
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={editedUser.lastName}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, lastName: text })
              }
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              value={editedUser.houseColor}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, houseColor: text })
              }
              placeholder="House Color"
            />
            <TextInput
              style={styles.input}
              value={editedUser.class}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, class: text })
              }
              placeholder="Class"
            />
            <View style={styles.buttonContainer}>
              <Button title="Update" onPress={handleUpdate} />
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                color="red"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});

export default UserDetails;
