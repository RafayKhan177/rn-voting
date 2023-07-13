import React from "react";
import AllCampaign from "./components/AllCampaign";
import NewCampaign from "./components/NewCampaign";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../../constants";

export default function ManageCampaigns() {
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <NewCampaign />
          <AllCampaign />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
