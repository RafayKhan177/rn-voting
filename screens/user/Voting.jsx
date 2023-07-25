import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import ScreenHading from "../../components/ScreenHading";
import { colors } from "../../constants";
import firebase from "../../firebase";

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

        const nomineeIds = campaignsData.flatMap((campaign) =>
          Object.values(campaign.nominees)
        );
        const positionIds = campaignsData.map((campaign) => campaign.position);

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

        setCampaigns(campaignsData);
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
          alert(`Vote recorded for selected nominee`);
        } else {
          alert("You have already voted for this position.");
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
      <ScrollView>
        <ScreenHading txt={"All Campaigns"} />
        <View style={styles.gridContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            campaigns.map((campaign, index) => {
              const nomineeWithMostVotes = nomineePictures[index];
              // console.log(nomineeWithMostVotes);
              return (
                <Card key={campaign.id} style={styles.card}>
                  <Card.Cover
                    source={
                      nomineeWithMostVotes
                        ? { uri: nomineeWithMostVotes }
                        : require("../../assets/businessman-character-avatar.jpg")
                    }
                    style={styles.cardMedia}
                  />

                  <Card.Content>
                    <Text style={styles.positionText}>
                      {positionNames[campaign.position] || "Position"}
                    </Text>
                    {Object.values(campaign.nominees).map(
                      (nomineeId, index) => (
                        <View key={index}>
                          <Button
                            mode="contained"
                            onPress={() => handleVote(campaign.id, nomineeId)}
                            disabled={
                              currentDateTime <
                                new Date(
                                  campaign.startDate
                                    .split("/")
                                    .reverse()
                                    .join("-")
                                ) ||
                              currentDateTime >
                                new Date(
                                  campaign.endDate
                                    .split("/")
                                    .reverse()
                                    .join("-")
                                )
                            }
                            style={[
                              styles.voteButton,
                              {
                                opacity:
                                  currentDateTime <
                                    new Date(
                                      campaign.startDate
                                        .split("/")
                                        .reverse()
                                        .join("-")
                                    ) ||
                                  currentDateTime >
                                    new Date(
                                      campaign.endDate
                                        .split("/")
                                        .reverse()
                                        .join("-")
                                    )
                                    ? 0.5
                                    : 1,
                              },
                            ]}
                          >
                            <Text style={styles.nomineeText}>
                              Vote: {nomineeNames[nomineeId] || "Nominee"}
                            </Text>
                          </Button>
                        </View>
                      )
                    )}
                  </Card.Content>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundPrimary,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: colors.backgroundSecoundary,
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
    color: colors.textPrimary,
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  nomineeText: {
    fontSize: 12,
    marginVertical: 4,
    color: colors.textsecoundary,
    fontWeight: "bold",
  },
  voteButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
});
