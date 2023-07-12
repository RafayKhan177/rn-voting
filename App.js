import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import AuthNavigation from "./naivgation/AuthNavigation";
import { AdminScreens, colors } from "./constants";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <TopBar screens={AdminScreens} /> */}
      <AuthNavigation />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
