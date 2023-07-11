import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminStack, AuthStack, UserStack } from "./navigation";

export default function AuthNavigation() {
  const [userData, setUserData] = useState(null);
  console.log(userData);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        if (data) {
          const parsedData = JSON.parse(data);
          setUserData(parsedData);
        }
      } catch (error) {
        console.log("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, []);

  if (userData && userData.role === "admin") {
    return <AdminStack />;
    // return <h1>AdminStack</h1>;
  } else if (userData) {
    return <UserStack />;
    // return <h1>UserStack</h1>;
  } else {
    return <AuthStack />;
    // return <h1>AuthStack</h1>;
  }
}
