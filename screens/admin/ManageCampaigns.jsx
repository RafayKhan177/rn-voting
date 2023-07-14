import React from "react";
import AllCampaign from "./components/AllCampaign";
import NewCampaign from "./components/NewCampaign";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../../constants";
import ScreenHading from "../../components/ScreenHading";

export default function ManageCampaigns() {
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <ScreenHading txt={"Manage Campaigns"} />
          <NewCampaign />
          <ScreenHading txt={"All Campaigns"} />
          <AllCampaign />
        </View>
      </ScrollView>
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
