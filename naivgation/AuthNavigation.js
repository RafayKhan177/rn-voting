import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminStack, AuthStack, UserStack } from "./navigation";
import { ScreenLoading } from "../components";

export default function AuthNavigation() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    getUserData(); // Call the async function immediately inside useEffect

    // Clean up the component (optional)
    return () => {
      // You can add cleanup code here if needed
    };
  }, []); // The empty dependency array ensures the useEffect runs only once on mount

  if (loading) {
    return <ScreenLoading />;
  } else if (userData && userData.role === "admin") {
    return <AdminStack />;
  } else if (userData) {
    return <UserStack />;
  } else {
    return <AuthStack />;
  }
}
