import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScreenLoading } from "../components";
import { AdminStack, AuthStack, UserStack } from "./navigation";

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

    getUserData();

    return () => {};
  }, []);

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
