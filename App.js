import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { colors } from "./constants";
import AuthNavigation from "./naivgation/AuthNavigation";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AuthNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
