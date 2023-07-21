export const userPicture =
  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1688908975~exp=1688909575~hmac=1e9639f92a0b0665ed4f28843631fdc549ae8d2cc6923f12c55a1f3957400b76";

export const colors = {
  primary: "#ef233c",
  primaryAccent: "#1d3557",
  secoundary: "#d80032",
  secoundaryAccent: "#FFC857",
  background: "#000",
  backgroundAccent: "rgba(240, 248, 255, 0.082)",
  text: "#fefae0",
  textLight: "#e5e5e5",
};

export const AdminScreens = [
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
  { name: "Voting", screen: "VotingScreen", icon: "check-square-o" },
  { name: "Campaigns Result", screen: "ResultScreen", icon: "address-card" },
  { name: "My Account", screen: "MyAccountScreen", icon: "address-card" },
];

export const UserScreens = [
  { name: "Voting", screen: "VotingScreen", icon: "check-square-o" },
  { name: "My Account", screen: "MyAccountScreen", icon: "address-card" },
  { name: "Campaigns Result", screen: "ResultScreen", icon: "address-card" },
];

export const AuthScreens = [
  { name: "Sign In", screen: "SignupScreen" },
  { name: "Sign Up", screen: "SigninScreen" },
];
