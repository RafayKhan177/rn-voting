const userPicture = require('./assets/businessman-character-avatar.webp');
 
const colors = {
  primary: "#ef233c",
  primaryAccent: "#1d3557",
  secoundary: "#d80032",
  secoundaryAccent: "#FFC857",
  background: "#000",
  backgroundAccent: "rgba(240, 248, 255, 0.082)",
  text: "#fefae0",
  textLight: "#e5e5e5",
};

const AdminScreens = [
  { name: "Dashboard", screen: "DashboardScreen", icon: "dashboard" },
  { name: "Manage Nominee", screen: "ManageNomineeScreen", icon: "users" },
  {
    name: "Manage Campaigns",
    screen: "ManageCampaignsScreen",
    icon: "list",
  },
  {
    name: "Manage Position & Office",
    screen: "ManagePositionOfficeScreen",
    icon: "briefcase",
  },
  { name: "Manage Users", screen: "ManageUsersScreen", icon: "check-square-o" },
  { name: "Voting", screen: "VotingScreen", icon: "check-square-o" },
  { name: "Campaigns Result", screen: "ResultScreen", icon: "address-card" },
  { name: "My Account", screen: "MyAccountScreen", icon: "address-card" },
];

const UserScreens = [
  { name: "Voting", screen: "VotingScreen", icon: "check-square-o" },
  { name: "My Account", screen: "MyAccountScreen", icon: "address-card" },
  { name: "Campaigns Result", screen: "ResultScreen", icon: "address-card" },
];

const AuthScreens = [
  { name: "Sign In", screen: "SignupScreen" },
  { name: "Sign Up", screen: "SigninScreen" },
];

export {
  userPicture,
  colors,
  AdminScreens,
  UserScreens,
  AuthScreens,
}