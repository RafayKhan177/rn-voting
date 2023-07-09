import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import firebase from "../../firebase";

export default function Register() {
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
    <View>
      <View>
        <Text>Sign up</Text>
      </View>
      <View>
        <View>
          <Text>First Name</Text>
          <TextInput onChangeText={(text) => setValue("firstName", text)} />
          {errors.firstName && <Text>{errors.firstName.message}</Text>}
        </View>
        <View>
          <Text>Last Name</Text>
          <TextInput onChangeText={(text) => setValue("lastName", text)} />
          {errors.lastName && <Text>{errors.lastName.message}</Text>}
        </View>
        <View>
          <Text>House Color</Text>
          <TextInput onChangeText={(text) => setValue("houseColor", text)} />
          {errors.houseColor && <Text>{errors.houseColor.message}</Text>}
        </View>
        <View>
          <Text>Class</Text>
          <TextInput onChangeText={(text) => setValue("class", text)} />
          {errors.class && <Text>{errors.class.message}</Text>}
        </View>
        <View>
          <Text>Email Address</Text>
          <TextInput onChangeText={(text) => setValue("email", text)} />
          {errors.email && <Text>{errors.email.message}</Text>}
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            onChangeText={(text) => setValue("password", text)}
            secureTextEntry
          />
          {errors.password && <Text>{errors.password.message}</Text>}
        </View>
        <View>
          <Text>Confirm Password</Text>
          <TextInput
            onChangeText={(text) => setValue("confirmPassword", text)}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text>{errors.confirmPassword.message}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
