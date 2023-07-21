import React from "react";
import { useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants";
import firebase from "../../firebase";

export default function Signup({ navigation }) {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password === data.confirmPassword) {
      try {
        const userCredential = await firebase
          .auth()
          .createUserWithEmailAndPassword(data.email, data.password);
        const user = userCredential.user;

        const db = firebase.firestore();
        const userRef = db.collection("users").doc();
        await userRef.set({
          role: "user",
          firstName: data.firstName,
          lastName: data.lastName,
          houseColor: data.houseColor,
          class: data.class,
          email: data.email,
          firstPassword: data.password,
        });
        console.log("User data stored successfully");
        console.log("User created successfully:", user);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
      console.log("Passwords must be the same");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      <View style={styles.inputContainer}>
        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>First Name</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="First Name"
            style={styles.input}
            onChangeText={(text) => setValue("firstName", text)}
          />
          {errors.firstName && <Text>{errors.firstName.message}</Text>}
        </View>
        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>Last Name</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="Last Name"
            style={styles.input}
            onChangeText={(text) => setValue("lastName", text)}
          />
          {errors.lastName && <Text>{errors.lastName.message}</Text>}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>House Color</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="House Color"
            style={styles.input}
            onChangeText={(text) => setValue("houseColor", text)}
          />
          {errors.houseColor && <Text>{errors.houseColor.message}</Text>}
        </View>

        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>Class</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="Class"
            style={styles.input}
            onChangeText={(text) => setValue("class", text)}
          />
          {errors.class && <Text>{errors.class.message}</Text>}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>Email Address</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="Email Address"
            style={styles.input}
            onChangeText={(text) => setValue("email", text)}
          />
          {errors.email && <Text>{errors.email.message}</Text>}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>Password</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="Password"
            style={styles.input}
            onChangeText={(text) => setValue("password", text)}
            secureTextEntry
          />
          {errors.password && <Text>{errors.password.message}</Text>}
        </View>

        <View style={styles.textInput}>
          {/* <Text style={styles.textInputText}>Confirm Password</Text> */}
          <TextInput
            placeholderTextColor={colors.text}
            placeholder="Confirm Password"
            style={styles.input}
            onChangeText={(text) => setValue("confirmPassword", text)}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text>{errors.confirmPassword.message}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push("SigninScreen")}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
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
    flexDirection: "row",
    flexWrap: "wrap",
  },
  textInput: {
    margin: 4,
    maxWidth: 300,
    width: 700,
    padding: 5,
  },
  textInputText: {
    color: colors.textLight,
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: "900",
  },
  input: {
    backgroundColor: colors.backgroundAccent,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  signUpButton: {
    backgroundColor: colors.primaryAccent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    maxWidth: 300,
    width: 700,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
  },
});
