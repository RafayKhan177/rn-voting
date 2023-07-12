import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  CheckBox,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from "../../../firebase";
import { Picker } from "react-native";

export default function NewCampaign() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const showStartDatePicker = () => {
    setStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisible(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisible(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

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
            <CheckBox
              value={newCampaign.nominees.includes(nominee.id)}
              onValueChange={() => handleNomineeSelection(nominee.id)}
            />
            <Text>
              {`${nominee.firstName} ${nominee.lastName}, Bio: ${nominee.biography}`}
            </Text>
          </View>
        ))}

        <Text style={styles.label}>Start Date:</Text>
        <TouchableWithoutFeedback onPress={showStartDatePicker}>
          <View style={styles.dateInput}>
            <Text>
              {startDate ? startDate.toDateString() : "Select start date"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <DateTimePickerModal
          isVisible={!!startDate}
          mode="date"
          date={startDate || new Date()}
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
        />

        <Text style={styles.label}>End Date:</Text>
        <TouchableWithoutFeedback onPress={showEndDatePicker}>
          <View style={styles.dateInput}>
            <Text>{endDate ? endDate.toDateString() : "Select end date"}</Text>
          </View>
        </TouchableWithoutFeedback>
        <DateTimePickerModal
          isVisible={!!endDate}
          mode="date"
          date={endDate || new Date()}
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
        />

        <View style={styles.buttonContainer}>
          <Button title="Add Campaign" onPress={handleAddCampaign} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Your styles here
});
