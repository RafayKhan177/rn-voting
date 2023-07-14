import React from "react";
import ReactLoading from "react-loading";
import { colors } from "../constants";
import { View, StyleSheet } from "react-native";

export default function ScreenLoading() {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <ReactLoading
          type="bubbles"
          color={colors.primary}
          height={50}
          width={50}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
