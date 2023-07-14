import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AdminScreens, colors } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { ScreenHading } from "../../components";
import Icon from "react-native-vector-icons/FontAwesome";

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
        <ScreenHading txt={"Dashboard"} />
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.statTitle}>Total Campaigns</Text>
              <Text style={styles.statValue}>{totalCampaigns}</Text>
            </View>
            <Icon
              style={styles.cardIcon}
              name="flag"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.statTitle}>Total Nominees</Text>
              <Text style={styles.statValue}>{totalNominees}</Text>
            </View>
            <Icon
              style={styles.cardIcon}
              name="users"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.statTitle}>Total Positions/Offices</Text>
              <Text style={styles.statValue}>{totalPositions}</Text>
            </View>
            <Icon
              style={styles.cardIcon}
              name="briefcase"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.statTitle}>Total Users</Text>
              <Text style={styles.statValue}>{totalUsers}</Text>
            </View>
            <Icon
              style={styles.cardIcon}
              name="user"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>
        <ScreenHading txt={"Management Sections"} />
        <View style={styles.sectionContainer}>
          {AdminScreens.map((screen, ind) => (
            <TouchableOpacity
              key={ind}
              onPress={() => handleNavigate(screen.screen)}
              style={styles.sectionButton}
            >
              <Icon
                style={{ textAlign: "center", paddingHorizontal: 10 }}
                name={screen.icon}
                size={20}
                color={colors.textLight}
              />
              <Text style={styles.sectionButtonText}>{screen.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingTop: 30,
    paddingBottom: 30,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.backgroundAccent,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 29,
    maxWidth: 400,
    minWidth: 100,
    width: "100%",
    alignSelf: "center",
    margin: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // cardInfo: {},
  // cardIcon: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 29,
    maxWidth: 300,
    minWidth: 100,
    width: "100%",
    margin: 12,
    display: "flex",
    flexDirection: "row",
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
};
