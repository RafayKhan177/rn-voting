import { StyleSheet, Text } from "react-native";
import { colors } from "../constants";

export default function ScreenHading({ txt }) {
  return <Text style={styles.heading}>{txt}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.text,
    backgroundColor: colors.backgroundAccent,
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
});
