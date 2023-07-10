import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import firebase from "../../firebase";

export default function ManagePositionOffice() {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    name: "",
    description: "",
  });
  const [editPosition, setEditPosition] = useState(null);

  useEffect(() => {
    const db = firebase.firestore();
    const positionsCollection = db.collection("positions");
    const unsubscribe = positionsCollection.onSnapshot((snapshot) => {
      const positionData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPositions(positionData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleInputChange = (name, value) => {
    setNewPosition((prevPosition) => ({
      ...prevPosition,
      [name]: value,
    }));
  };

  const addPosition = async () => {
    const db = firebase.firestore();
    const positionsCollection = db.collection("positions");
    try {
      const newPositionDoc = await positionsCollection.add(newPosition);
      const newPositionData = { id: newPositionDoc.id, ...newPosition };
      setPositions((prevPositions) => [...prevPositions, newPositionData]);
      setNewPosition({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding position: ", error);
    }
  };

  const editPositionData = (position) => {
    setEditPosition(position);
    setNewPosition({
      name: position.name,
      description: position.description,
    });
  };

  const updatePosition = async () => {
    const db = firebase.firestore();
    const positionRef = db.collection("positions").doc(editPosition.id);
    try {
      await positionRef.update(newPosition);
      setEditPosition(null);
      setNewPosition({ name: "", description: "" });
    } catch (error) {
      console.error("Error updating position: ", error);
    }
  };

  const deletePosition = async (position) => {
    const db = firebase.firestore();
    const positionRef = db.collection("positions").doc(position.id);
    try {
      await positionRef.delete();
    } catch (error) {
      console.error("Error deleting position: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Positions/Offices</Text>

      <View style={styles.formContainer}>
        <TextInput
          name="name"
          placeholder="Office"
          value={newPosition.name}
          onChangeText={(text) => handleInputChange("name", text)}
          style={styles.input}
        />
        <TextInput
          name="description"
          placeholder="Position"
          value={newPosition.description}
          onChangeText={(text) => handleInputChange("description", text)}
          style={styles.input}
        />
        {editPosition ? (
          <Button onPress={updatePosition} title="Update" />
        ) : (
          <Button onPress={addPosition} title="Add" />
        )}
      </View>

      {positions.map((position) => (
        <View style={styles.positionContainer} key={position.id}>
          <View>
            <Text style={styles.positionName}>{position.name}</Text>
            <Text>{position.description}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={() => editPositionData(position)} />
            <Button title="Delete" onPress={() => deletePosition(position)} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
  },
  positionContainer: {
    marginBottom: 8,
  },
  positionName: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
