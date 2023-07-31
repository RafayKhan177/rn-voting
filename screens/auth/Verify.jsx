import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { colors } from "../../constants";
import firebase from "../../firebase";

export default function Verify({ navigation }) {
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const sendOtp = async () => {
    setLoading(true);
    try {
      const { phone } = getValues();
      console.log(phone);
      const phoneNumber = phone;
      const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);

      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
        throw new Error("Invalid phone number format");
      }

      const appVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);

      setConfirmationResult(confirmationResult);
      setVerificationId(confirmationResult.verificationId);
      console.log("Phone verification code sent:", confirmationResult);
      setLoading(false);
    } catch (error) {
      console.error("Error signing up with phone number:", error);
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    const { email, password } = getValues();
    console.log(email, password);
    setLoading(true);

    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!confirmationResult) {
        throw new Error("Please send OTP first");
      }

      const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await user.linkWithCredential(phoneCredential);

      console.log("Phone number linked successfully to user:", user);
      setLoading(false);
      navigation.push("Signin");
    } catch (error) {
      console.error("Error linking phone number to user:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.secoundary} />
      ) : null}
      <View>
        <Text style={styles.title}> Verify</Text>
      </View>
      <View>
        <Text style={styles.title}> Email</Text>
        <Controller
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              color={colors.textPrimary}
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.errText}> {errors.email.message}</Text>
        )}
      </View>
      <View>
        <Text style={styles.title}> Password</Text>
        <Controller
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              color={colors.textPrimary}
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.errText}> {errors.password.message}</Text>
        )}
      </View>
      <View>
        <Text style={styles.title}> Phone Number</Text>
        <Controller
          control={control}
          rules={{ required: "Phone Number is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              color={colors.textPrimary}
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          name="phone"
        />
        {errors.phone && (
          <Text style={styles.errText}> {errors.phone.message}</Text>
        )}
      </View>
      <View>
        <Button style={styles.btn} title="Send OTP" onPress={sendOtp} />
        <Text style={styles.title}> Verification Code</Text>
        <TextInput
          color={colors.textPrimary}
          style={styles.input}
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(text)}
        />
      </View>
      <View id="recaptcha-container"></View>
      <Button
        style={styles.btn}
        title="Verify"
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundPrimary,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 5,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.backgroundSecoundary,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.textPrimary,
    marginBottom: 10,
    width: "100%",
    maxWidth: 500,
    minWidth: 250,
  },
  errText: {
    color: colors.secoundary,
    fontSize: 14,
  },
  btn: {
    margin: 10,
  },
});
