import * as Updates from "expo-updates";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../constants";
import firebase from "../../firebase";
import AsyncStorage from "@react-native-community/async-storage";

export default function Signin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    console.log(password);

    if (trimmedEmail && password) {
      try {
        setLoading(true);
        const signInResult = await firebase
          .auth()
          .signInWithEmailAndPassword(trimmedEmail, password);

        if (signInResult) {
          // User is signed in successfully, check for phone number link
          const usersCollection = firebase.firestore().collection("users");
          const userQuery = usersCollection.where("email", "==", trimmedEmail);
          const userSnapshot = await userQuery.get();

          if (userSnapshot.empty) {
            Alert.alert("User not found");
            return;
          }

          const userData = userSnapshot.docs[0].data();
          console.log(signInResult);

          // Check if the user has a linked phone number
          if (signInResult.user.phoneNumber !== null) {
            // Corrected access to phoneNumber
            // Show error message
            Alert.alert(
              "Error",
              "Email is not linked with a phone number. Please sign in with a linked account."
            );

            // Set loading to false
            setLoading(false);

            // Don't store data in AsyncStorage if email is not linked to a phone number
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            // Perform app reload
            Updates.reloadAsync();

            return;
          }

          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error signing in:", error);
        Alert.alert("Error signing in. Please try again later.", error.message);
      }
    } else {
      Alert.alert("Incomplete fields", "Don't leave any field empty");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : null}

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
          <TouchableOpacity onPress={() => navigation.push("Signup")}>
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
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
  },
});
