import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import firebase from "../../firebase";
import { colors, userPicture } from "../../constants";

export default function ResultPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [nomineeNames, setNomineeNames] = useState({});
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
          } else {
            return {
              [nomineeId]: "Nominee",
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
        return {
          pictureUrl,
          nomineeId,
          voteCount: voteCounts[nomineeWithMostVotes],
        };
      }
    }

    return null;
  };

  const parseFirebaseDate = (dateString) => {
    const [month, day, year] = dateString.split("/");
    // Note: JavaScript Date uses zero-based month index, so subtract 1 from the month
    return new Date(year, month - 1, day);
  };

  const renderResultCard = (campaign) => {
    const endDate = parseFirebaseDate(campaign.endDate);
    const currentDateTime = new Date();

    if (endDate > currentDateTime) {
      // Skip campaigns that haven't ended yet
      return null;
    }

    const winnerInfo = getNomineeWithMostVotes(campaign);

    if (!winnerInfo) {
      return null;
    }

    const { pictureUrl, nomineeId, voteCount } = winnerInfo;
    const nomineeName = nomineeNames[nomineeId] || "Nominee";

    return (
      <Card key={campaign.id} style={styles.card}>
        <Card.Cover
          source={{
            uri: pictureUrl || userPicture,
          }}
          style={styles.cardMedia}
        />

        <Card.Content>
          <Text style={styles.positionText}>
            {positionNames[campaign.position] || "Position"}
          </Text>
          <View style={styles.resultContainer}>
            <Text style={styles.winnerLabel}>WINNER</Text>
            <Text style={styles.voteCountText}>{voteCount} votes</Text>
            <Text style={styles.nomineeText}>{nomineeName}</Text>
          </View>
          <Text style={styles.otherVotesText}>Other Votes:</Text>
          {Object.keys(campaign.nominees).map((nomineeId) => {
            if (nomineeId !== winnerInfo.nomineeId) {
              const votes = campaign.votes || {};
              const nomineeVotes = Object.values(votes).filter(
                (vote) => vote === nomineeId
              );
              const nominee = nomineeNames[nomineeId] || "Nominee";
              return (
                <Text key={nomineeId} style={styles.voteDetailsText}>
                  {nominee}: {nomineeVotes.length} votes
                </Text>
              );
            }
            return null;
          })}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : campaigns.length === 0 ? (
        <Text>No campaigns found</Text>
      ) : (
        campaigns.map(renderResultCard)
      )}
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
  resultContainer: {
    alignItems: "center",
  },
  winnerLabel: {
    fontSize: 16,
    marginVertical: 4,
    color: "green",
    fontWeight: "bold",
  },
  voteCountText: {
    fontSize: 16,
    marginVertical: 4,
    color: colors.textLight,
    fontWeight: "bold",
  },
  nomineeText: {
    fontSize: 20,
    marginVertical: 4,
    color: colors.text,
    fontWeight: "bold",
  },
  otherVotesText: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
    color: colors.text,
    fontWeight: "bold",
  },
  voteDetailsText: {
    fontSize: 16,
    marginVertical: 4,
    color: colors.textLight,
  },
});
