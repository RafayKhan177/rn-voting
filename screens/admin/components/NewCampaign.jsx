import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import firebase from "../../../firebase";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../../../constants";

export default function NewCampaign() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    position: "",
    nominees: [],
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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

  const handleStartDateConfirm = (event, date) => {
    if (date) {
      setStartDate(date);
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateConfirm = (event, date) => {
    if (date) {
      setEndDate(date);
    }
    setShowEndDatePicker(false);
  };

  const handleAddCampaign = async () => {
    const db = firebase.firestore();
    const campaignsCollection = db.collection("campaigns");

    try {
      const campaignData = {
        position: newCampaign.position,
        nominees: newCampaign.nominees,
        startDate: startDate.toLocaleDateString("en-GB"),
        endDate: endDate.toLocaleDateString("en-GB"),
      };

      await campaignsCollection.add(campaignData);

      setNewCampaign({
        position: "",
        nominees: [],
      });
      setStartDate(null);
      setEndDate(null);
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
              label={`${position.name} / ${position.description}`}
              value={position.id}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Select Nominees:</Text>
        {nominees.map((nominee) => (
          <View key={nominee.id} style={styles.nomineeOption}>
            <Switch
              value={newCampaign.nominees.includes(nominee.id)}
              onValueChange={() => handleNomineeSelection(nominee.id)}
              style={styles.switch}
            />
            <Text style={styles.nomineeText}>
              {`${nominee.firstName} ${nominee.lastName}, Bio: ${nominee.biography}`}
            </Text>
          </View>
        ))}

        <Text style={styles.label}>Start Date:</Text>
        <TouchableWithoutFeedback onPress={() => setShowStartDatePicker(true)}>
          <View style={styles.dateInput}>
            <Text>
              {startDate
                ? startDate.toLocaleDateString("en-GB")
                : "Select start date"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateConfirm}
            style={styles.dateTimePicker}
          />
        )}

        <Text style={styles.label}>End Date:</Text>
        <TouchableWithoutFeedback onPress={() => setShowEndDatePicker(true)}>
          <View style={styles.dateInput}>
            <Text>
              {endDate
                ? endDate.toLocaleDateString("en-GB")
                : "Select end date"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateConfirm}
            style={styles.dateTimePicker}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button title="Add Campaign" onPress={handleAddCampaign} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: colors.backgroundAccent,
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  input: {
    height: 40,
    // borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: colors.text,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: colors.text,
  },
  nomineeOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  dateInput: {
    height: 40,
    // borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 20,
  },
  dateTimePickerContainer: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.backgroundAccent,
  },
  dateTimePicker: {
    color: "#fff",
  },
  switch: {
    marginRight: 10,
  },
  nomineeText: {
    color: colors.text,
  },
});
