import React, { useState } from "react";
import firebase from "../../firebase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../constants";

export default function Signin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      // const userCredential =
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // const user = userCredential.user;

      // Fetch user data from "users" collection
      const usersCollection = firebase.firestore().collection("users");
      const userQuery = usersCollection.where("email", "==", email);
      const userSnapshot = await userQuery.get();

      if (userSnapshot.empty) {
        console.log("User not found");
        return;
      }

      const userData = userSnapshot.docs[0].data();

      // Save user data to AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // console.log("signed in", userData);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Sign in</Text>
        <View style={styles.textInput}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCompleteType="email"
            autoFocus
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#999999"
          />
        </View>

        <View style={styles.textInput}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCompleteType="password"
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor="#999999"
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push("SignupScreen")}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
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
    backgroundColor: colors.backgroundAccent,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  signInButton: {
    backgroundColor: colors.primaryAccent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkContainer: {
    flexDirection: "row",
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
  },
});
