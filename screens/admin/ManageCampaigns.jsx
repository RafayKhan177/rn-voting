import React from "react";
import { StyleSheet, View } from "react-native";
import ScreenHading from "../../components/ScreenHading";
import { colors } from "../../constants";
import AllCampaign from "./components/AllCampaign";
import NewCampaign from "./components/NewCampaign";

export default function ManageCampaigns() {
  return (
    <View style={styles.container}>
      {/* <ScrollView> */}
      <ScreenHading txt={"Manage Campaigns"} />
      <NewCampaign />
      <ScreenHading txt={"All Campaigns"} />
      <AllCampaign />
      {/* </ScrollView> */}
    </View>
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
