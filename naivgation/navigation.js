import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TopBar from "../components/TopBar";
import { AdminScreens, AuthScreens, UserScreens } from "../constants";
import {
  Dashboard,
  ManageCampaigns,
  ManageNominee,
  ManagePositionOffice,
  ManageUsers,
} from "../screens/admin";
import { Signin, Signup } from "../screens/auth";
import { MyAccount, Result, Voting } from "../screens/user";
import ManageUsersDetails from "../screens/admin/ManageUsersDetails";

const Stack = createStackNavigator();

const userOptions = {
  header: () => <TopBar screens={UserScreens} />,
};
const adminOptions = {
  header: () => <TopBar screens={AdminScreens} />,
};

const authOptions = {
  header: () => <TopBar screens={AuthScreens} />,
};

const UserStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="VotingScreen"
        screenOptions={userOptions}
      >
        <Stack.Screen
          name="VotingScreen"
          component={Voting}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen name="ResultScreen" component={Result} />
        <Stack.Screen name="MyAccountScreen" component={MyAccount} />
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
        <Stack.Screen name="VotingScreen" component={Voting} />
        <Stack.Screen
          name="ManageUsersDetailsScreen"
          component={ManageUsersDetails}
        />
        <Stack.Screen name="DashboardScreen" component={Dashboard} />
        <Stack.Screen
          name="ManageCampaignsScreen"
          component={ManageCampaigns}
        />
        <Stack.Screen name="ManageNomineeScreen" component={ManageNominee} />
        <Stack.Screen
          name="ManagePositionOfficeScreen"
          component={ManagePositionOffice}
        />
        <Stack.Screen name="MyAccountScreen" component={MyAccount} />
        <Stack.Screen name="ResultScreen" component={Result} />
        <Stack.Screen name="ManageUsersScreen" component={ManageUsers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SigninScreen"
        screenOptions={authOptions}
      >
        <Stack.Screen name="SignupScreen" component={Signup} />
        <Stack.Screen name="SigninScreen" component={Signin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { AdminStack, AuthStack, UserStack };
