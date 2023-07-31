import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { ScreenLoading } from "../../components";
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../constants";
import firebase from "../../firebase";

export default function Verify() {
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phone, setPhone] = useState("+92");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const sendOtp = async () => {
    setLoading(true);
    try {
      const phoneNumber = `${phone}`;
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

      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      console.log("Phone verification code sent:", confirmationResult);
      setLoading(false);
    } catch (error) {
      console.error("Error signing up with phone number:", error);
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await user.linkWithCredential(phoneCredential);

      console.log("Phone number linked successfully to user:", user);
      setLoading(false);
    } catch (error) {
      console.error("Error linking phone number to user:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : null}
      <View>
        <View>
          <Text style={styles.title}> Verify</Text>
        </View>
        <View>
          <Text style={styles.title}> Email</Text>
          <TextInput
            style={styles.input}
            {...register("email", {
              required: "Email is required",
            })}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {errors.email && (
            <Text style={styles.errText}> {errors.email.message}</Text>
          )}
        </View>
        <View>
          <Text style={styles.title}> Password</Text>
          <TextInput
            style={styles.input}
            {...register("password", {
              required: "Password is required",
            })}
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {errors.password && (
            <Text style={styles.errText}> {errors.password.message}</Text>
          )}
        </View>
        <View>
          <Text style={styles.title}> Phone Number</Text>
          <TextInput
            style={styles.input}
            {...register("phone", {
              required: "Phone Number is required",
            })}
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />
          {errors.phone && (
            <Text style={styles.errText}> {errors.phone.message}</Text>
          )}
        </View>
        <View>
          <Button title="Send OTP" onPress={sendOtp} />
          <Text style={styles.title}> Verification Code</Text>
          <TextInput
            style={styles.input}
            {...register("verificationCode", {
              required: "Verification Code is required",
            })}
            value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
          />
          {errors.verificationCode && (
            <Text style={styles.errText}>
              {" "}
              {errors.verificationCode.message}
            </Text>
          )}
        </View>
        <View id="recaptcha-container"></View>
        <Button title="Verify" onPress={handleSubmit(onSubmit)} />
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
    color: colors.textsecoundary,
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: "900",
  },
  input: {
    backgroundColor: colors.backgroundSecoundary,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  errText: {
    color: colors.primary,
    fontSize: 14,
  },
});
