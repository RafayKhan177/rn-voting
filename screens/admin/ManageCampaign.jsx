import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  Picker,
  TextInput,
} from "react-native";
import firebase from "../../firebase";

export default function ManageCampaign() {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [nomineeNames, setNomineeNames] = useState({});
  const [positions, setPositions] = useState([]);
  const [positionNames, setPositionNames] = useState({});
  const [editCampaign, setEditCampaign] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const db = firebase.firestore();
  // <<!======================================= Fetch nominees & positions
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

  // |===>
  // <<!======================================= Fetch campaigns
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

  // |===>
  // <<!======================================= Fetch Position Name
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns]);

  // |===>
  // <<!======================================= Fetch Nominee Name
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
  // |===>

  // <<!======================================= To handle basic tasks
  const handleInputChange = (e) => {
    setNewCampaign({
      ...newCampaign,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    setEditCampaign({
      ...editCampaign,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateCampaign = async () => {
    const campaignRef = db.collection("campaigns").doc(editCampaign.id);

    try {
      await campaignRef.update(editCampaign);
      setOpenModal(false);
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
    setOpenModal(true);
  };

  const handleCloseEditModal = () => {
    setEditCampaign(null);
    setOpenModal(false);
  };
  // |===>

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
                name="position"
                value={editCampaign.position}
                onValueChange={(value) =>
                  handleEditInputChange("position", value)
                }
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
                name="nominees"
                value={editCampaign.nominees}
                onValueChange={(value) =>
                  handleEditInputChange("nominees", value)
                }
                multiple
              >
                {nominees.map((nominee) => (
                  <Picker.Item key={nominee.id} value={nominee.id}>
                    {nominee.firstName}, {nominee.lastName}, {nominee.biography}
                  </Picker.Item>
                ))}
              </Picker>
              <TextInput
                name="startDate"
                type="date"
                label="Start Date"
                value={editCampaign.startDate}
                onChange={(value) => handleEditInputChange("startDate", value)}
              />
              <TextInput
                name="endDate"
                type="date"
                label="End Date"
                value={editCampaign.endDate}
                onChange={(value) => handleEditInputChange("endDate", value)}
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
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
});
