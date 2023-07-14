import { Text, View } from "react-native";
import { colors } from "../../constants";

export default function MyAccount() {
  return (
    <View style={style.container}>
      <Text style={style.txt}>My Account Soon </Text>
    </View>
  );
}

const style = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  txt: {
    color: colors.text,
  },
};
