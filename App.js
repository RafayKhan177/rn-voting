import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import AuthNavigation from "./naivgation/AuthNavigation";
import { colors } from "./constants";

export default function App() {
  return (
    <View style={styles.container}>
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
