import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "../../../constants";
import firebase from "../../../firebase";
import ScreenHeading from "../../../components/ScreenHading";

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

  const handleStartDateConfirm = (_event, date) => {
    if (date) {
      setStartDate(date);
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateConfirm = (_event, date) => {
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
    <View style={styles.container}>
      <ScreenHeading txt={"Manage Campaigns"} />
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
            <Text style={{ color: colors.textLight }}>
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
            <Text style={{ color: colors.textLight }}>
              {endDate
                ? endDate.toLocaleDateString("en-GB")
                : "Select end date"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            plh
            mode="date"
            display="default"
            onChange={handleEndDateConfirm}
            style={styles.dateTimePicker}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleAddCampaign}
          >
            <Text style={styles.btntxt}>Add Campaign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    flex: 1,
  },
  card: {
    backgroundColor: colors.backgroundAccent,
    borderRadius: 8,
    padding: 30,
    elevation: 5,
    width: "90%",
    marginLeft: "3%",
  },
  input: {
    backgroundColor: colors.backgroundAccent,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
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
  button: {
    backgroundColor: colors.primaryAccent,
    margin: 3,
    borderRadius: 7,
    padding: 12,
    color: colors.text,
  },
  btntxt: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  errorButton: {
    backgroundColor: colors.secoundary,
    margin: 3,
    fontSize: 15,
    fontWeight: "900",
    borderRadius: 7,
    padding: 12,
    color: colors.text,
  },
});
