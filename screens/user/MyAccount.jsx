import NetInfo from "@react-native-community/netinfo";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import ScreenHading from "../../components/ScreenHading";
import { colors } from "../../constants";
import firebase from "../../firebase/config";
import AsyncStorage from "@react-native-community/async-storage";
import { useToast } from "react-native-toast-notifications";

export default function MyAccount() {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isOnline, setIsOnline] = useState(true);
  const [storedUserData, setStoredUserData] = useState({});

  const toast = useToast();
  const notify = (message, type) => {
    toast.show(message, {
      type: type || "normal",
      placement: "top",
      duration: 4000,
    });
  };

  useEffect(() => {
    getUserData();
    checkInternetConnection();
  }, []);

  const deleteUserAcc = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(data);
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(userData.email, userData.firstPassword);
      const usersRef = firebase.firestore().collection("users");
      const querySnapshot = await usersRef
        .where("email", "==", userData.email)
        .get();
      if (querySnapshot.size === 0) {
        notify("No matching user documents found.");
        return;
      }
      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        await docSnapshot.ref.delete();
      });
      await Promise.all(deletePromises);
      notify(`${querySnapshot.size} All details deleted successfully.`);
      await userCredential.user.delete();
      notify("Account deleted successfully");
      firebase.auth().signOut();
    } catch (error) {
      notify("Something went wrong");
    }
  };

  const checkInternetConnection = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  };

  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      const data = JSON.parse(userDataString);
      setStoredUserData(data);
      const email = data.email;
      if (email) {
        const db = firebase.firestore();
        const userRef = db.collection("users").where("email", "==", email);
        const snapshot = await userRef.get();
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            const data = doc.data();
            setUserData(data);
            setEditedData(data);
          });
        }
      }
    } catch (error) {
      notify("Error fetching user data");
    }
  };

  const handleInputChange = (name, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const db = firebase.firestore();
      const userRef = db
        .collection("users")
        .where("email", "==", userData.email);
      const snapshot = await userRef.get();

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const docId = doc.id;
          const docRef = db.collection("users").doc(docId);
          docRef.update(editedData);
        });
      }

      await AsyncStorage.setItem("userData", JSON.stringify(editedData));
      setUserData(editedData);
      setEditMode(false);
      handleSignOut();
    } catch (error) {
      notify("Error updating user data: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      Updates.reloadAsync();
    } catch (error) {
      notify("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHading
        txt={`${userData.email || storedUserData.email}`}
        size={12}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txt}>Class:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.class}
            onChangeText={(text) => handleInputChange("class", text)}
            editable={isOnline}
          />
        ) : (
          <Text style={styles.txt}>
            {userData.class || storedUserData.class}
          </Text>
        )}

        <Text style={styles.txt}>First Name:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
            editable={isOnline}
          />
        ) : (
          <Text style={styles.txt}>
            {userData.firstName || storedUserData.firstName}
          </Text>
        )}

        <Text style={styles.txt}>Last Name:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.lastName}
            onChangeText={(text) => handleInputChange("lastName", text)}
            editable={isOnline}
          />
        ) : (
          <Text style={styles.txt}>
            {userData.lastName || storedUserData.lastName}
          </Text>
        )}

        <Text style={styles.txt}>House:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.houseColor}
            onChangeText={(text) => handleInputChange("houseColor", text)}
            editable={isOnline}
          />
        ) : (
          <Text style={styles.txt}>
            {userData.houseColor || storedUserData.houseColor}
          </Text>
        )}

        <Text style={styles.txt}>known Name:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.knownName}
            onChangeText={(text) => handleInputChange("knownName", text)}
            editable={isOnline}
          />
        ) : (
          <Text style={styles.txt}>
            {userData.knownName || storedUserData.knownName}
          </Text>
        )}

        {editMode ? (
          <Button title="Save" onPress={handleSave} disabled={!isOnline} />
        ) : (
          <Button title="Edit" onPress={handleEdit} disabled={!isOnline} />
        )}

        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
      <Button title="Delete My Account Permanently" onPress={deleteUserAcc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "90%",
    maxWidth: 500,
    minWidth: 200,
    backgroundColor: colors.backgroundSecoundary,
    padding: 30,
    borderRadius: 15,
  },
  txt: {
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecoundary,
    borderRadius: 10,
  },
});
