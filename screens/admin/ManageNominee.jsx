import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import firebase from "../../firebase";
import * as ImagePicker from "expo-image-picker";

export default function ManageNominee() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nomineeData, setNomineeData] = useState({
    firstName: "",
    lastName: "",
    biography: "",
    picture: "",
  });
  const [nominees, setNominees] = useState([]);

  const db = firebase.firestore();

  useEffect(() => {
    const nomineesCollection = db.collection("nominees");
    const unsubscribe = nomineesCollection.onSnapshot((snapshot) => {
      const nomineesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNominees(nomineesData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNomineeData({ firstName: "", lastName: "", biography: "", picture: "" });
  };

  const handleInputChange = (name, value) => {
    if (name === "picture") {
      setSelectedFile(value);
    } else {
      setNomineeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSaveNominee = async () => {
    try {
      let nomineeDataWithPicture = { ...nomineeData };
      if (selectedFile) {
        const response = await fetch(selectedFile);
        const blob = await response.blob();

        const uniqueName = Date.now().toString();
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`nomineePictures/${uniqueName}`);

        await fileRef.put(blob);
        const downloadURL = await fileRef.getDownloadURL();

        nomineeDataWithPicture = {
          ...nomineeDataWithPicture,
          picture: downloadURL || "",
        };
      }
      await db.collection("nominees").add(nomineeDataWithPicture);
      handleDialogClose();
    } catch (error) {
      console.error("Error saving nominee: ", error);
    }
  };

  const handleEditNominee = (nominee) => {
    setNomineeData(nominee);
    handleDialogOpen();
  };

  const handleUpdateNominee = async () => {
    try {
      let nomineeDataWithPicture = { ...nomineeData };
      if (selectedFile) {
        const response = await fetch(selectedFile);
        const blob = await response.blob();

        const uniqueName = Date.now().toString();
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`nomineePictures/${uniqueName}`);

        await fileRef.put(blob);
        const downloadURL = await fileRef.getDownloadURL();

        nomineeDataWithPicture = {
          ...nomineeDataWithPicture,
          picture: downloadURL || "",
        };
      }
      await db
        .collection("nominees")
        .doc(nomineeData.id)
        .update(nomineeDataWithPicture);
      handleDialogClose();
    } catch (error) {
      console.error("Error updating nominee: ", error);
    }
  };

  const handleDeleteNominee = async (nominee) => {
    try {
      await db.collection("nominees").doc(nominee.id).delete();
    } catch (error) {
      console.error("Error deleting nominee: ", error);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedFile(result.uri);
        setNomineeData((prevData) => ({
          ...prevData,
          picture: result.uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Manage Nominees
        </Text>
        <Button title="Add Nominee" onPress={handleDialogOpen} />
      </View>
      <ScrollView>
        {nominees.map((nominee) => (
          <View
            key={nominee.id}
            style={{
              padding: 16,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Image
              source={{ uri: nominee.picture }}
              style={{
                width: 100,
                height: 100,
                marginBottom: 8,
                borderRadius: 50,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
              {nominee.firstName} {nominee.lastName}
            </Text>
            <Text style={{ color: "#666", marginBottom: 8 }}>
              {nominee.biography}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                title="Edit"
                onPress={() => handleEditNominee(nominee)}
                style={{ marginRight: 8 }}
              />
              <Button
                title="Delete"
                onPress={() => handleDeleteNominee(nominee)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {dialogOpen && (
        <View>
          <Text>{nomineeData.id ? "Edit" : "Add"} Nominee</Text>
          <View>
            <TextInput
              label="First Name"
              value={nomineeData.firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Last Name"
              value={nomineeData.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Biography"
              value={nomineeData.biography}
              onChangeText={(value) => handleInputChange("biography", value)}
              multiline={true}
              numberOfLines={4}
              style={{ marginBottom: 8 }}
            />
            <Button
              title="Add Picture"
              onPress={handlePickImage}
              style={{ marginBottom: 8 }}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button title="cancel" onPress={handleDialogClose} />
            <Button
              onPress={nomineeData.id ? handleUpdateNominee : handleSaveNominee}
              title={nomineeData.id ? "Update" : "Save"}
            />
          </View>
        </View>
      )}
    </View>
  );
}
