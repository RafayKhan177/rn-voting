import { Button, View, StyleSheet, Platform, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";

export default function VerifyRD({ navigation }) {
  if (Platform.OS === "web") {
    navigation.push("Verify");
  }
  return (
    <View style={styles.container}>
      {Platform.OS !== "web" ? (
        <View style={styles.container}>
          <Text style={styles.txt}>
            Please press the "Verify" button to proceed to the verification
            page. Before proceeding with the sign-in process, kindly verify your
            email address.
          </Text>
          <Button
            title="Verify Email"
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://rn-voting-rafaykhan177.vercel.app/"
              )
            }
            style={styles.button}
          />
        </View>
      ) : null}
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
  txt: {
    fontWeight: "900",
  },
});
