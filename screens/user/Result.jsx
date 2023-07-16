import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import firebase from "../../firebase";
import { colors, userPicture } from "../../constants";
import ScreenHading from "../../components/ScreenHading";

export default function Voting() {
  const [campaigns, setCampaigns] = useState([]);
  const [nomineeNames, setNomineeNames] = useState({});
  const [nomineePictures, setNomineePictures] = useState([]);
  const [positionNames, setPositionNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const campaignsCollection = db.collection("campaigns");

      try {
        const campaignsSnapshot = await campaignsCollection.get();
        const campaignsData = campaignsSnapshot.docs.map((doc) => {
          const campaign = doc.data();
          campaign.id = doc.id;
          return campaign;
        });

        // Filter campaigns based on the end date
        const currentDate = new Date();
        const filteredCampaigns = campaignsData.filter(
          (campaign) =>
            new Date(campaign.endDate.split("/").reverse().join("-")) <
            currentDate
        );

        const nomineeIds = filteredCampaigns.flatMap((campaign) =>
          Object.values(campaign.nominees)
        );
        const positionIds = filteredCampaigns.map(
          (campaign) => campaign.position
        );

        const nomineeNamesPromises = nomineeIds.map(async (nomineeId) => {
          const nomineeDoc = await db
            .collection("nominees")
            .doc(nomineeId)
            .get();
          if (nomineeDoc.exists) {
            const nomineeData = nomineeDoc.data();
            return {
              [nomineeId]: nomineeData.firstName + " " + nomineeData.lastName,
            };
          }
        });

        const positionNamesPromises = positionIds.map(async (positionId) => {
          const positionDoc = await db
            .collection("positions")
            .doc(positionId)
            .get();
          if (positionDoc.exists) {
            const positionData = positionDoc.data();
            return {
              [positionId]:
                positionData.name + ` / ` + positionData.description,
            };
          }
        });

        const nomineeNamesResults = await Promise.all(nomineeNamesPromises);
        const positionNamesResults = await Promise.all(positionNamesPromises);

        const nomineeNames = Object.assign({}, ...nomineeNamesResults);
        const positionNames = Object.assign({}, ...positionNamesResults);

        setCampaigns(filteredCampaigns); // Update to use 'filteredCampaigns' instead of 'campaignsData'
        setNomineeNames(nomineeNames);
        setPositionNames(positionNames);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVote = async (campaignId, nomineeId) => {
    const user = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(user);
    const userEmail = userData.email;

    const db = firebase.firestore();
    const campaignRef = db.collection("campaigns").doc(campaignId);

    try {
      const campaignDoc = await campaignRef.get();
      if (campaignDoc.exists) {
        const campaignData = campaignDoc.data();
        const votes = campaignData.votes || {};

        // Check if the user with this email has already voted for this campaign
        if (!votes[userEmail]) {
          votes[userEmail] = nomineeId;
          await campaignRef.update({ votes });
          console.log(`Vote recorded for nominee with ID ${nomineeId}`);
        } else {
          console.log("You have already voted for this position.");
        }
      }
    } catch (error) {
      console.error("Error recording vote:", error);
    }
  };

  const currentDateTime = new Date();

  const getNomineeWithMostVotes = async (campaign) => {
    const db = firebase.firestore();
    const votes = campaign.votes || {};
    const voteCounts = {};

    Object.values(votes).forEach((nomineeId) => {
      voteCounts[nomineeId] = (voteCounts[nomineeId] || 0) + 1;
    });

    if (Object.keys(voteCounts).length === 0) {
      return null;
    }

    const nomineeIds = Object.keys(voteCounts);
    const nomineeWithMostVotes = nomineeIds.reduce((a, b) =>
      voteCounts[a] > voteCounts[b] ? a : b
    );

    const nomineeDoc = await db
      .collection("nominees")
      .doc(nomineeWithMostVotes)
      .get();

    if (nomineeDoc.exists) {
      const nomineeData = nomineeDoc.data();
      const nomineeId = Object.keys(campaign.nominees).find(
        (key) => campaign.nominees[key] === nomineeWithMostVotes
      );

      if (nomineeId) {
        const pictureUrl = nomineeData.picture || userPicture;
        return pictureUrl;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchNomineePictures = async () => {
      const pictures = await Promise.all(
        campaigns.map((campaign) => getNomineeWithMostVotes(campaign))
      );
      setNomineePictures(pictures);
    };

    fetchNomineePictures();
  }, [campaigns]);

  return (
    <View style={styles.container}>
      <ScreenHading txt={"Campaigns Results"} />
      <View style={styles.gridContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          campaigns.map((campaign, index) => {
            const nomineeWithMostVotes = nomineePictures[index];
            return (
              <Card key={campaign.id} style={styles.card}>
                <Card.Cover
                  source={{
                    uri: nomineeWithMostVotes || userPicture,
                  }}
                  style={styles.cardMedia}
                />

                <Card.Content>
                  <Text style={styles.positionText}>
                    {positionNames[campaign.position] || "Position"}
                  </Text>
                  {Object.values(campaign.nominees).map((nomineeId, index) => {
                    const voteCount = Object.values(
                      campaign.votes || {}
                    ).filter(
                      (voteNomineeId) => voteNomineeId === nomineeId
                    ).length;

                    return (
                      <View key={index}>
                        <Button
                          mode="contained"
                          onPress={() => handleVote(campaign.id, nomineeId)}
                          disabled={true}
                          style={[styles.voteButton]}
                        >
                          <Text style={styles.nomineeText}>
                            {`${
                              nomineeNames[nomineeId] || "Nominee"
                            } (${voteCount} votes)`}
                          </Text>
                        </Button>
                      </View>
                    );
                  })}
                </Card.Content>
              </Card>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
  },
  card: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: colors.backgroundAccent,
    maxWidth: 400,
    margin: 4,
  },
  cardMedia: {
    height: 200,
  },
  positionText: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    color: colors.text,
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  nomineeText: {
    fontSize: 20,
    marginVertical: 4,
    color: colors.textLight,
    fontWeight: "bold",
  },
  voteButton: {
    backgroundColor: colors.primaryAccent,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
});
