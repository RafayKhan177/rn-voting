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
import { colors } from "../../constants";
import ScreenHeading from "../../components/ScreenHading";

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
      <ScreenHeading txt="User Details" />
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Role:</Text>
          <Text style={styles.detailValue}>{user.role}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>First Name:</Text>
          <Text style={styles.detailValue}>{user.firstName}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Last Name:</Text>
          <Text style={styles.detailValue}>{user.lastName}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>House Color:</Text>
          <Text style={styles.detailValue}>{user.houseColor}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Class:</Text>
          <Text style={styles.detailValue}>{user.class}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{user.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>First Password:</Text>
          <Text style={styles.detailValue}>{user.firstPassword}</Text>
        </View>
      </View>

      {!isEditing ? (
        <TouchableOpacity onPress={handleEditPress}>
          <View style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Details</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <Modal visible={isEditing} animationType="slide">
          <View style={styles.modalContainer}>
            <ScreenHeading txt="Edit User Details" />
            <TextInput
              style={styles.input}
              value={editedUser.role}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, role: text })
              }
              placeholder="Role"
              color={colors.textLight}
            />
            <TextInput
              style={styles.input}
              value={editedUser.firstName}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, firstName: text })
              }
              placeholder="First Name"
              color={colors.textLight}
            />
            <TextInput
              style={styles.input}
              value={editedUser.lastName}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, lastName: text })
              }
              placeholder="Last Name"
              color={colors.textLight}
            />
            <TextInput
              style={styles.input}
              value={editedUser.houseColor}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, houseColor: text })
              }
              placeholder="House Color"
              color={colors.textLight}
            />
            <TextInput
              style={styles.input}
              value={editedUser.class}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, class: text })
              }
              placeholder="Class"
              color={colors.textLight}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleUpdate}>
                <View style={styles.updateButton}>
                  <Text style={styles.buttonText}>Update</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.text,
  },
  detailsContainer: {
    backgroundColor: colors.backgroundAccent,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textLight,
  },
  editButton: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  editButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  updateButton: {
    alignItems: "center",
    backgroundColor: colors.primaryAccent,
    padding: 12,
    borderRadius: 8,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: colors.secoundary,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserDetails;
