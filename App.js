import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
// import NewCampaign from "./screens/admin/NewCampaign";
// import ManageCampaign from "./screens/admin/ManageCampaign";
import Voting from "./screens/user/Voting";

export default function App() {
  return (
    <View style={styles.container}>
      <Voting />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
