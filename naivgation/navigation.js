import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  Dashboard,
  ManageCampaign,
  ManageNominee,
  ManagePositionOffice,
  NewCampaign,
} from "../screens/admin";
import { Voting } from "../screens/user";
import { Signin, Signup } from "../screens/auth";
import TopBar from "../components/TopBar";
import { AdminScreens, UserScreens } from "../constants";

const Stack = createStackNavigator();

const userOptions = {
  header: () => <TopBar screens={UserScreens} />,
};
const adminOptions = {
  header: () => <TopBar screens={AdminScreens} />,
};

const UserStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreenScreen"
        screenOptions={userOptions}
      >
        <Stack.Screen
          name="HomeScreenScreen"
          component={Voting}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AdminStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DashboardScreen"
        screenOptions={adminOptions}
      >
        <Stack.Screen name="DashboardScreen" component={Dashboard} />
        <Stack.Screen name="ManageCampaignScreen" component={ManageCampaign} />
        <Stack.Screen name="ManageNomineeScreen" component={ManageNominee} />
        <Stack.Screen
          name="ManagePositionOfficeScreen"
          component={ManagePositionOffice}
        />
        <Stack.Screen name="NewCampaignScreen" component={NewCampaign} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SigninScreen"
        // screenOptions={screenOption}
      >
        <Stack.Screen name="SignupScreen" component={Signup} />
        <Stack.Screen name="SigninScreen" component={Signin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { UserStack, AdminStack, AuthStack };
