import { Button, View, StyleSheet, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

export default function VerifyRD({ navigation }) {
  if (Platform.OS === "web") {
    navigation.push("Verify");
  }
  return (
    <View style={styles.container}>
      <Button
        title="Verify Email"
        onPress={() => WebBrowser.openBrowserAsync("https://expo.dev")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 600,
  },
  button: {
    marginTop: 500,
    width: "100%",
    maxWidth: 700,
    justifyContent: "center",
    alignItems: "center",
  },
});
