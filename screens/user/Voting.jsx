import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Snackbar } from "react-native-paper";
import ScreenHading from "../../components/ScreenHading";
import { colors } from "../../constants";
import firebase from "../../firebase/config";
import AsyncStorage from "@react-native-community/async-storage";
import UserDataUpdate from "../../components/userDataUpdate";

// const HandleVoteModal = ({ campaignId, nomineeId, position, nominee }) => {
//   const handleVoteF = async () => {
//     const user = await AsyncStorage.getItem("userData");
//     const userData = JSON.parse(user);
//     const userEmail = userData.email;

//     const db = firebase.firestore();
//     const campaignRef = db.collection("campaigns").doc(campaignId);

//     try {
//       const campaignDoc = await campaignRef.get();
//       if (campaignDoc.exists) {
//         const campaignData = campaignDoc.data();
//         const votes = campaignData.votes || {};
//         if (!votes[userEmail]) {
//           votes[userEmail] = nomineeId;
//           await campaignRef.update({ votes });
//           showErrorAlert(
//             `"Thank You" "Your Vote for ${nominee} as ${position} is now recorded"`
//           );
//         } else {
//           showErrorAlert(
//             `"Too Late to change your mind" "You already voted for ${nominee} as ${position}"`
//           );
//         }
//       }
//     } catch (error) {
//       showErrorAlert("Error recording vote:", error);
//     }
//   };

//   const showErrorAlert = (title, message) => {
//     alert(title, message);
//   };

//   const [snackbarVisible, setSnackbarVisible] = useState(t);

//   const handleVoteWithConfirmation = () => {
//     setSnackbarVisible(true);
//   };

//   const handleSnackbarDismiss = () => {
//     setSnackbarVisible(false);
//   };

//   return (
//     <View style={{ marginTop: 300, backgroundColor: colors.primary }}>

//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={handleSnackbarDismiss}
//         action={{
//           label: "Vote",
//           onPress: () => {
//             handleVoteF();
//             setSnackbarVisible(false);
//           },
//         }}
//       >
//         <Text>Are you sure you want to vote for this nominee?</Text>
//       </Snackbar>
//     </View>
//   );
// };

export default function Voting() {
  const [campaigns, setCampaigns] = useState([]);
  const [nomineeNames, setNomineeNames] = useState({});
  const [positionNames, setPositionNames] = useState({});
  const [loading, setLoading] = useState(true);
  const crrDate = new Date().toISOString().slice(0, 10).replace(/-/g, "/");

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const campaignsCollection = db.collection("campaigns");

      try {
        const campaignsSnapshot = await campaignsCollection
          .where("endDate", ">=", crrDate)
          .get();
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
              id: nomineeId,
              name: nomineeData.firstName + " " + nomineeData.lastName,
              picture: nomineeData.picture, // Assuming 'picture' is the field for nominee picture URL
              bio: nomineeData.biography, // Assuming 'bio' is the field for nominee bio
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

        const nomineeDataResults = await Promise.all(nomineeNamesPromises);
        const nomineeDataMap = nomineeDataResults.reduce((map, nominee) => {
          if (nominee) map[nominee.id] = nominee;
          return map;
        }, {});

        const positionNamesResults = await Promise.all(positionNamesPromises);

        const positionNames = Object.assign({}, ...positionNamesResults);

        setCampaigns(campaignsData);
        setNomineeNames(nomineeDataMap);
        setPositionNames(positionNames);
        setLoading(false);
      } catch (error) {
        showErrorAlert("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [voteInfo, setVoteInfo] = useState({
    campaignId: "",
    nomineeId: "",
    position: "",
    nominee: "",
  });

  const handleVoteF = async () => {
    const user = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(user);
    const userEmail = userData.email;

    const db = firebase.firestore();
    const campaignRef = db.collection("campaigns").doc(voteInfo.campaignId);

    try {
      const campaignDoc = await campaignRef.get();
      if (campaignDoc.exists) {
        const campaignData = campaignDoc.data();
        const votes = campaignData.votes || {};
        if (!votes[userEmail]) {
          votes[userEmail] = voteInfo.nomineeId;
          await campaignRef.update({ votes });
          showErrorAlert(
            `"Thank You" "Your Vote for ${voteInfo.nominee} as ${voteInfo.position} is now recorded"`
          );
        } else {
          showErrorAlert(
            `"Too Late to change your mind" "You already voted for ${voteInfo.nominee} as ${voteInfo.position}"`
          );
        }
      }
    } catch (error) {
      showErrorAlert("Error recording vote:", error);
    }
  };

  const showErrorAlert = (title, message) => {
    alert(title, message);
  };

  const [snackbarVisible, setSnackbarVisible] = useState();

  const handleVoteWithConfirmation = () => {
    setSnackbarVisible(true);
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  return (
    <View style={styles.container}>
      <UserDataUpdate />
      <ScreenHading txt={"All Campaigns"} />

      <View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={handleSnackbarDismiss}
          action={{
            label: "Vote",
            onPress: () => {
              handleVoteF();
              setSnackbarVisible(false);
            },
          }}
        >
          <Text>Are you sure you want to vote for {voteInfo.nominee}?</Text>
        </Snackbar>
      </View>
      <ScrollView>
        <View style={styles.gridContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            campaigns.map((campaign, index) => {
              return (
                <Card
                  key={index}
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 10,
                    backgroundColor: colors.backgroundSecoundary,
                  }}
                >
                  <Text style={styles.cardDate}>
                    Campaign {campaign.startDate} from {campaign.endDate}
                  </Text>
                  <View style={styles.cardContainer}>
                    <Text style={styles.positionText}>
                      {positionNames[campaign.position] || "Position"}
                    </Text>
                    {Object.values(campaign.nominees).map(
                      (nomineeId, index) => (
                        <View key={index}>
                          {nomineeNames[nomineeId] && (
                            <View style={styles.card}>
                              <Image
                                style={styles.cardImage}
                                source={
                                  nomineeNames[nomineeId].picture
                                    ? { uri: nomineeNames[nomineeId].picture }
                                    : require("../../assets/businessman-character-avatar.jpg")
                                }
                              />
                              <View>
                                <Text
                                  style={styles.cardNominee}
                                  onPress={() =>
                                    alert(
                                      nomineeNames[nomineeId].name || "loading"
                                    )
                                  }
                                >
                                  {((text, maxChars) =>
                                    text.length > maxChars
                                      ? text.substring(0, maxChars) + "..."
                                      : text)(
                                    nomineeNames[nomineeId].name || "loading",
                                    20
                                  )}
                                </Text>
                                <Text
                                  style={styles.cardBio}
                                  onPress={() =>
                                    alert(
                                      nomineeNames[nomineeId].bio ||
                                        "No bio available"
                                    )
                                  }
                                >
                                  <Text style={styles.cardBio}>
                                    {((text, maxChars) =>
                                      text.length > maxChars
                                        ? text.substring(0, maxChars) + "..."
                                        : text)(
                                      nomineeNames[nomineeId].bio ||
                                        "No bio available",
                                      70
                                    )}
                                  </Text>
                                </Text>
                              </View>
                            </View>
                          )}
                          <Button
                            mode="contained"
                            onPress={() => {
                              const newVoteInfo = {
                                campaignId: campaign.id,
                                nomineeId: nomineeId,
                                position: positionNames[campaign.position],
                                nominee:
                                  nomineeNames[nomineeId]?.name || "Nominee",
                              };
                              setVoteInfo(newVoteInfo);
                              handleVoteWithConfirmation();
                            }}
                            disabled={
                              crrDate < campaign.startDate ||
                              crrDate > campaign.endDate
                            }
                            style={[
                              styles.voteButton,
                              {
                                backgroundColor:
                                  crrDate < campaign.startDate ||
                                  crrDate > campaign.endDate
                                    ? colors.primaryAccent
                                    : colors.primary,
                              },
                            ]}
                          >
                            <Text style={styles.voteButtonText}>
                              Vote: {nomineeNames[nomineeId]?.name || "Nominee"}
                            </Text>
                          </Button>
                        </View>
                      )
                    )}
                  </View>
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
    width: "100%",
  },

  positionText: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    color: colors.textPrimary,
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  voteButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  cardContainer: {
    backgroundColor: colors.backgroundSecoundary,
    padding: 10,
    borderRadius: 10,
    width: 300,
    marginHorizontal: 10,
  },
  card: {
    display: "flex",
    flexDirection: "row",
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 5,
  },
  cardNominee: {
    fontSize: 12,
    marginVertical: 4,
    color: colors.textPrimary,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cardBio: {
    fontSize: 12,
    marginVertical: 4,
    color: colors.textsecoundary,
    fontWeight: "bold",
    marginLeft: 10,
    width: 130,
  },
  cardDate: {
    fontSize: 12,
    marginVertical: 4,
    color: colors.textsecoundary,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
