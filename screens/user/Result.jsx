import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import ScreenHading from "../../components/ScreenHading";
import { colors } from "../../constants";
import firebase from "../../firebase/config";

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
        const crrDate = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "/");
        const filteredCampaigns = campaignsData.filter(
          (campaign) => campaign.endDate < crrDate
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

        setCampaigns(filteredCampaigns);
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
        const pictureUrl = nomineeData.picture;
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
                    source={
                      nomineeWithMostVotes
                        ? { uri: nomineeWithMostVotes }
                        : require("../../assets/businessman-character-avatar.jpg")
                    }
                    style={styles.cardMedia}
                  />
                  <Card.Content>
                    <View
                      style={{
                        backgroundColor: colors.secoundary,
                        borderRadius: 15,
                        paddingHorizontal: 15,
                        margin: 15,
                        alignSelf: "center",
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "900",
                          color: colors.textsecoundary,
                        }}
                      >
                        WINNER
                      </Text>
                    </View>
                    <Text style={styles.positionText}>
                      {positionNames[campaign.position] || "Position"}{" "}
                    </Text>
                    {Object.values(campaign.nominees).map(
                      (nomineeId, index) => {
                        const voteCount = Object.values(
                          campaign.votes || {}
                        ).filter(
                          (voteNomineeId) => voteNomineeId === nomineeId
                        ).length;

                        return (
                          <View key={index}>
                            <Button
                              mode="contained"
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
                      }
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
    backgroundColor: colors.primaryAccent,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
});
