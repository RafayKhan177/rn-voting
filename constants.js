const colors = {
  primary: "#ef233c",
  primaryAccent: "#2a9d8f",
  secoundary: "#d80032",
  secoundaryAccent: "#FFC857",
  backgroundPrimary: "#000",
  backgroundSecoundary: "rgba(240, 248, 255, 0.099)",
  textPrimary: "#fefae0",
  textsecoundary: "#e5e5e5",
};

const AdminScreens = [
  { name: "Dashboard", screen: "Dashboard", icon: "dashboard" },
  {
    name: "Position/Offices",
    screen: "ManagePositionOffice",
    icon: "briefcase",
  },
  { name: "Nominees", screen: "ManageNominee", icon: "users" },
  {
    name: "Campaigns",
    screen: "ManageCampaigns",
    icon: "list",
  },
  { name: "Account", screen: "MyAccount", icon: "address-card" },
  { name: "Vote Result", screen: "Result", icon: "address-card" },
  { name: "Voting", screen: "Voting", icon: "check-square-o" },
  { name: "Users", screen: "ManageUsers", icon: "check-square-o" },
];

const UserScreens = [
  { name: "Voting", screen: "Voting", icon: "check-square-o" },
  { name: "My Account", screen: "MyAccount", icon: "address-card" },
  { name: "Campaigns Result", screen: "Result", icon: "address-card" },
];

const AuthScreens = [
  { name: "Sign In", screen: "Signup" },
  { name: "Sign Up", screen: "Signin" },
  { name: "Verify", screen: "verify" },
];

export {
  colors,
  AdminScreens,
  UserScreens,
  AuthScreens,
}