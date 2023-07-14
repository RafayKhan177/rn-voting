import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminStack, AuthStack, UserStack } from "./navigation";

export default function AuthNavigation() {
  const [userData, setUserData] = useState(null);
  // console.log(userData);

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

    const checkForDataChanges = async () => {
      const newData = await AsyncStorage.getItem("userData");
      if (newData !== JSON.stringify(userData)) {
        getUserData();
      }
    };

    const interval = setInterval(checkForDataChanges, 100);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [userData]);

  if (userData && userData.role === "admin") {
    return <AdminStack />;
  } else if (userData) {
    return <UserStack />;
  } else {
    return <AuthStack />;
  }
}
