import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { AdminScreens, colors } from "../../constants";
import { useNavigation } from "@react-navigation/native";

export default function Dashboard() {
  // Example data
  const totalCampaigns = 10;
  const totalNominees = 25;
  const totalPositions = 5;
  const totalUsers = 100;

  const navigation = useNavigation();
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Dashboard</Text>

              <View style={styles.rowContainer}>
                <View style={styles.statContainer}>
                  <Text style={styles.statTitle}>Total Campaigns</Text>
                  <Text style={styles.statValue}>{totalCampaigns}</Text>
                </View>

                <View style={styles.statContainer}>
                  <Text style={styles.statTitle}>Total Nominees</Text>
                  <Text style={styles.statValue}>{totalNominees}</Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.statContainer}>
                  <Text style={styles.statTitle}>Total Positions/Offices</Text>
                  <Text style={styles.statValue}>{totalPositions}</Text>
                </View>

                <View style={styles.statContainer}>
                  <Text style={styles.statTitle}>Total Users</Text>
                  <Text style={styles.statValue}>{totalUsers}</Text>
                </View>
              </View>

              <View style={styles.managementContainer}>
                <Text style={styles.sectionTitle}>Management Sections</Text>
                <View style={styles.sectionContainer}>
                  {AdminScreens.map((screen, ind) => (
                    <TouchableOpacity
                      key={ind}
                      onPress={() => handleNavigate(screen.screen)}
                      style={styles.sectionButton}
                    >
                      <Text style={styles.sectionButtonText}>
                        {screen.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingTop: 30,
    paddingBottom: 30,
  },
  cardContainer: {
    maxWidth: "80%",
  },
  card: {
    elevation: 4,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statContainer: {
    backgroundColor: colors.cardBackgroundLight,
    borderRadius: 8,
    margin: 10,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  statTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
  },
  managementContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  sectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
};
