import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ManagePositionOffice from "./screens/admin/ManagePositionOffice";
// import Register from "./screens/auth/Signup";
// import Signin from "./screens/auth/Signin";
// import Verify from "./screens/auth/Verify";
// import Dashboard from "./screens/admin/Dashboard";
// import ManageNominee from "./screens/admin/ManageNominee";

export default function App() {
  return (
    <View style={styles.container}>
      <ManagePositionOffice />
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
