import * as Updates from "expo-updates";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { colors } from "../../constants";
import firebase from "../../firebase";
import AsyncStorage from "@react-native-community/async-storage";
import VerifyRD from "./VerifyRD";

export default function Signin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifybtn, setVerifybtn] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail && password) {
      try {
        setLoading(true);
        const signInResult = await firebase
          .auth()
          .signInWithEmailAndPassword(trimmedEmail, password);

        if (signInResult) {
          const userData = await getUserDataByEmail(trimmedEmail);

          if (userData) {
            if (signInResult.user.phoneNumber !== null) {
              setLoading(false);
              await AsyncStorage.setItem("userData", JSON.stringify(userData));
              Updates.reloadAsync();
            } else {
              setLoading(false);
              showErrorAlert(
                "Email isn't verified",
                "Please email before login!"
              );
              setVerifybtn(true);
            }
          } else {
            showErrorAlert("User not found", "User not found. Please sign up.");
          }
        }
      } catch (error) {
        setLoading(false);
        showErrorAlert("Error signing in", error.message);
      }
    } else {
      showErrorAlert("Incomplete fields", "Please fill in all the fields.");
    }
  };

  const getUserDataByEmail = async (email) => {
    const usersCollection = firebase.firestore().collection("users");
    const userQuery = usersCollection.where("email", "==", email);
    const userSnapshot = await userQuery.get();

    if (!userSnapshot.empty) {
      return userSnapshot.docs[0].data();
    }

    return null;
  };

  const showErrorAlert = (title, message) => {
    Alert.alert(title, message);
    console.log(title, message);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.verifyBtn}
            onPress={() => setVerifybtn(!verifybtn)}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: colors.backgroundPrimary,
                textAlign: "center",
              }}
            >
              Go to {verifybtn ? "Sign In" : "Verification"}
            </Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color={colors.primary} />}
          {verifybtn ? (
            <VerifyRD navigation={navigation} />
          ) : (
            <View style={styles.inputContainer}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.title}>Sign in</Text>
              <View style={styles.textInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  autoCompleteType="email"
                  autoFocus
                  onChangeText={(text) => setEmail(text)}
                  placeholderTextColor={colors.textsecoundary}
                />
              </View>

              <View style={styles.textInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  autoCompleteType="password"
                  onChangeText={(text) => setPassword(text)}
                  placeholderTextColor={colors.textsecoundary}
                />
              </View>

              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => navigation.push("Signup")}>
                  <Text style={styles.linkText}>
                    Don't have an account? Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundPrimary,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 700,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    margin: 4,
    maxWidth: 300,
    width: 700,
    padding: 5,
  },
  input: {
    backgroundColor: colors.backgroundSecoundary,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.textPrimary,
  },
  signInButton: {
    backgroundColor: colors.primaryAccent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkContainer: {
    flexDirection: "row",
  },
  linkText: {
    color: colors.primaryAccent,
    fontSize: 14,
    marginRight: 8,
  },
  verifyBtn: {
    width: "80%",
    maxWidth: 600,
    backgroundColor: colors.secoundaryAccent,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 8,
    position: "absolute",
    top: 30,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginTop: 100,
  },
});
