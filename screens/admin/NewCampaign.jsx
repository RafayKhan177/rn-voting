import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  CheckBox,
} from "react-native";
import firebase from "../../firebase";
import { Picker } from "react-native";
// import DatePicker from "react-native-datepicker";

export default function NewCampaign() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nominees, setNominees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    position: "",
    nominees: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCollections = async () => {
      const db = firebase.firestore();
      const nomineesCollection = db.collection("nominees");
      const positionsCollection = db.collection("positions");

      try {
        const nomineesSnapshot = await nomineesCollection.get();
        const nomineesData = nomineesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNominees(nomineesData);
      } catch (error) {
        console.error("Error fetching nominees: ", error);
      }

      try {
        const positionsSnapshot = await positionsCollection.get();
        const positionsData = positionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPositions(positionsData);
      } catch (error) {
        console.error("Error fetching positions: ", error);
      }
    };

    fetchCollections();
  }, []);

  const handleAddCampaign = async () => {
    const db = firebase.firestore();
    const campaignsCollection = db.collection("campaigns");

    try {
      await campaignsCollection.add({
        position: newCampaign.position,
        nominees: newCampaign.nominees,
        startDate,
        endDate,
      });
      setNewCampaign({
        position: "",
        nominees: [],
        startDate: "",
        endDate: "",
      });
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding campaign: ", error);
    }
  };

  const handleInputChange = (name, value) => {
    setNewCampaign({
      ...newCampaign,
      [name]: value,
    });
  };

  const handleNomineeSelection = (nomineeId) => {
    const selectedNominees = newCampaign.nominees.includes(nomineeId)
      ? newCampaign.nominees.filter((id) => id !== nomineeId)
      : [...newCampaign.nominees, nomineeId];

    handleInputChange("nominees", selectedNominees);
  };

  return (
    <View style={styles.addCampaignForm}>
      <Text style={styles.subtitle}>Add New Campaign</Text>

      <View style={styles.card}>
        <Picker
          name="position"
          selectedValue={newCampaign.position}
          onValueChange={(itemValue) =>
            handleInputChange("position", itemValue)
          }
          style={styles.input}
        >
          {positions.map((position) => (
            <Picker.Item
              key={position.id}
              label={`${position.name} / $  q{position.description}`}
              value={position.id}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Select Nominees:</Text>
        {nominees.map((nominee) => (
          <View key={nominee.id} style={styles.nomineeOption}>
            <CheckBox
              value={newCampaign.nominees.includes(nominee.id)}
              onValueChange={() => handleNomineeSelection(nominee.id)}
            />
            <Text>
              {`${nominee.firstName} ${nominee.lastName}, Bio: ${nominee.biography}`}
            </Text>
          </View>
        ))}

        {/* <Text style={styles.label}>Start Date:</Text>
        <DatePicker
          style={styles.datePicker}
          date={startDate}
          mode="date"
          placeholder="Select start date"
          format="YYYY-MM-DD"
          minDate={new Date().toISOString().split("T")[0]}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => setStartDate(date)}
        />

        <Text style={styles.label}>End Date:</Text>
        <DatePicker
          style={styles.datePicker}
          date={endDate}
          mode="date"
          placeholder="Select end date"
          format="YYYY-MM-DD"
          minDate={new Date().toISOString().split("T")[0]}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => setEndDate(date)}
        /> */}

        <View style={styles.buttonContainer}>
          <Button title="Add Campaign" onPress={handleAddCampaign} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  nomineeOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  addCampaignForm: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
  },
  datePicker: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
});
