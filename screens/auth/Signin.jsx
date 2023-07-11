import React, { useState } from "react";
import firebase from "../../firebase";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signin() {
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
    <View style={{ marginTop: 8, alignItems: "center" }}>
      <Text>Sign in</Text>
      <View>
        <TextInput
          style={{ marginVertical: 8 }}
          placeholder="Email"
          autoCompleteType="email"
          autoFocus
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={{ marginVertical: 8 }}
          placeholder="Password"
          secureTextEntry
          autoCompleteType="password"
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Sign In</Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity>
            <Text>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
