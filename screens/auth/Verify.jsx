// import   { useState } from "react";
// import { useForm } from "react-hook-form";
// import firebase from "../../firebase";
// import { parsePhoneNumberFromString } from "libphonenumber-js";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";

// export default function Verify() {
//   const [verificationId, setVerificationId] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [phone, setPhone] = useState("+92");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm();

//   const handleChange = (newPhone) => {
//     setPhone(newPhone);
//   };

//   const sendOtp = async () => {
//     try {
//       const phoneNumber = `${phone}`;
//       const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);

//       if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
//         throw new Error("Invalid phone number format");
//       }

//       const appVerifier = new firebase.auth.RecaptchaVerifier(
//         "recaptcha-container",
//         {
//           size: "invisible",
//         }
//       );

//       const confirmationResult = await firebase
//         .auth()
//         .signInWithPhoneNumber(phoneNumber, appVerifier);

//       setVerificationId(confirmationResult.verificationId);
//       console.log("Phone verification code sent:", confirmationResult);
//     } catch (error) {
//       console.error("Error signing up with phone number:", error);
//     }
//   };

//   const onSubmit = async () => {
//     try {
//       const userCredential = await firebase
//         .auth()
//         .signInWithEmailAndPassword(email, password);
//       const user = userCredential.user;

//       const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
//         verificationId,
//         verificationCode
//       );
//       await user.linkWithCredential(phoneCredential);

//       console.log("Phone number linked successfully to user:", user);
//     } catch (error) {
//       console.error("Error linking phone number to user:", error);
//     }
//   };

//   return (
//     <View>
//       <View>
//         <Text>Verify</Text>
//       </View>
//       <View>
//         <Text>Email</Text>
//         <TextInput
//           {...register("email", {
//             required: "Email is required",
//           })}
//           value={email}
//           onChangeText={(text) => setEmail(text)}
//         />
//         {errors.email && <Text>{errors.email.message}</Text>}
//       </View>
//       <View>
//         <Text>Password</Text>
//         <TextInput
//           {...register("password", {
//             required: "Password is required",
//           })}
//           secureTextEntry
//           value={password}
//           onChangeText={(text) => setPassword(text)}
//         />
//         {errors.password && <Text>{errors.password.message}</Text>}
//       </View>
//       <View>
//         <Text>Phone Number</Text>
//         <TextInput
//           {...register("phone", {
//             required: "Phone Number is required",
//           })}
//           value={phone}
//           onChangeText={(text) => handleChange(text)}
//         />
//         {errors.phone && <Text>{errors.phone.message}</Text>}
//       </View>
//       <View>
//         <Text>Verification Code</Text>
//         <TextInput
//           {...register("verificationCode", {
//             required: "Verification Code is required",
//           })}
//           value={verificationCode}
//           onChangeText={(text) => setVerificationCode(text)}
//         />
//         {errors.verificationCode && (
//           <Text>{errors.verificationCode.message}</Text>
//         )}
//       </View>
//       <View>
//         <TouchableOpacity onPress={sendOtp}>
//           <Text>Send OTP</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleSubmit(onSubmit)}>
//           <Text>Verify</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
