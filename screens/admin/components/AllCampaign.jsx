import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  TextInput,
} from "react-native";
import firebase from "../../../firebase";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../../../constants";

export default function AllCampaign() {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [nomineeNames, setNomineeNames] = useState({});
  const [positions, setPositions] = useState([]);
  const [positionNames, setPositionNames] = useState({});
  const [editCampaign, setEditCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const db = firebase.firestore();

  useEffect(() => {
    const fetchCollections = async () => {
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

  useEffect(() => {
    const campaignsCollection = db.collection("campaigns");

    const unsubscribe = campaignsCollection.onSnapshot((snapshot) => {
      const campaignData = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setCampaigns(campaignData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchPositionName = async (positionId) => {
    const positionRef = db.collection("positions").doc(positionId);

    try {
      const positionSnap = await positionRef.get();
      if (positionSnap.exists) {
        return positionSnap.data().name;
      }
    } catch (error) {
      console.error("Error fetching position name:", error);
    }
    return "";
  };

  const fetchPositionNames = async (campaigns) => {
    const positionIds = campaigns.map((campaign) => campaign.position);
    const positionsData = {};

    for (const positionId of positionIds) {
      positionsData[positionId] = await fetchPositionName(positionId);
    }

    setPositionNames(positionsData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      fetchPositionNames(campaigns);
    }
  }, [campaigns]);

  const fetchNomineeNames = async (nomineeIds) => {
    const namesData = {};

    try {
      for (const nomineeId of nomineeIds) {
        const nomineeDoc = await db.collection("nominees").doc(nomineeId).get();
        if (nomineeDoc.exists) {
          const fullName = `${nomineeDoc.data().firstName} ${
            nomineeDoc.data().lastName
          }`;
          namesData[nomineeId] = fullName;
        }
      }
    } catch (error) {
      console.error("Error fetching nominee names:", error);
    }

    setNomineeNames(namesData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      const nomineeIds = campaigns.flatMap((campaign) =>
        campaign.nominees.map((data) => data)
      );
      fetchNomineeNames(nomineeIds);
    }
  }, [campaigns]);

  const handleEditInputChange = (name, value) => {
    setEditCampaign({
      ...editCampaign,
      [name]: value,
    });
  };

  const handleUpdateCampaign = async () => {
    const { startDate, endDate } = editCampaign;

    // Validate date format (dd/mm/yyyy)
    const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!startDate.match(dateFormatRegex) || !endDate.match(dateFormatRegex)) {
      console.error("Invalid date format. Please use dd/mm/yyyy format.");
      return;
    }

    const campaignRef = db.collection("campaigns").doc(editCampaign.id);

    try {
      await campaignRef.update(editCampaign);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating campaign: ", error);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    const campaignRef = db.collection("campaigns").doc(campaignId);

    try {
      await campaignRef.delete();
    } catch (error) {
      console.error("Error deleting campaign: ", error);
    }
  };

  const handleOpenEditModal = (campaign) => {
    setEditCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditCampaign(null);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Campaigns</Text>

      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subheading}>
              Office / Position: {positionNames[item.position] || "none"}
            </Text>
            {item.nominees.map((data, ind) => (
              <Text key={data.id} style={styles.bodyText}>
                ({ind + 1}) Nominee: {nomineeNames[data]}
              </Text>
            ))}
            <Text style={styles.bodyText}>Start Date: {item.startDate}</Text>
            <Text style={styles.bodyText}>End Date: {item.endDate}</Text>

            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleOpenEditModal(item)} />
              <Button
                title="Delete"
                onPress={() => handleDeleteCampaign(item.id)}
              />
            </View>
          </View>
        )}
      />

      <Modal visible={isModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Edit Campaign</Text>

          {editCampaign && (
            <View style={styles.modalCard}>
              <Picker
                selectedValue={editCampaign.position}
                onValueChange={(value) =>
                  handleEditInputChange("position", value)
                }
                style={styles.picker}
              >
                {positions.map((position) => (
                  <Picker.Item
                    key={position.id}
                    value={position.id}
                    label={`${position.name} / ${position.description}`}
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={editCampaign.nominees}
                onValueChange={(value) =>
                  handleEditInputChange("nominees", value)
                }
                style={styles.picker}
                multiple
              >
                {nominees.map((nominee) => (
                  <Picker.Item
                    key={nominee.id}
                    value={nominee.id}
                    label={`${nominee.firstName}, ${nominee.lastName}, ${nominee.biography}`}
                  />
                ))}
              </Picker>

              <TextInput
                style={styles.input}
                name="startDate"
                value={editCampaign.startDate}
                onChangeText={(value) =>
                  handleEditInputChange("startDate", value)
                }
              />

              <TextInput
                style={styles.input}
                name="endDate"
                value={editCampaign.endDate}
                onChangeText={(value) =>
                  handleEditInputChange("endDate", value)
                }
              />

              <View style={styles.modalButtonContainer}>
                <Button
                  title="Update Campaign"
                  onPress={handleUpdateCampaign}
                />
              </View>
            </View>
          )}

          <Button title="Close" onPress={handleCloseEditModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  card: {
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: colors.backgroundAccent,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  bodyText: {
    marginBottom: 5,
    color: colors.textLight,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.text,
  },
  modalCard: {
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: colors.backgroundAccent,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: colors.text,
  },
  modalButtonContainer: {
    marginTop: 10,
  },
  picker: {
    color: colors.text,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
