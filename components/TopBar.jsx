import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../constants";
import { useNavigation } from "@react-navigation/native";

export default function TopBar({ screens }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
    toggleMenu();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleMenu = () => {
    if (showMenu) {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowMenu(false));
    } else {
      setShowMenu(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderPopupMenu = () => {
    const screenWidth = Dimensions.get("window").width;
    const isSmallDevice = screenWidth <= 414; // Adjust the threshold to your preference

    const menuWidth = isSmallDevice ? screenWidth * 0.8 : screenWidth * 0.3;
    const menuTranslateX = menuAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-menuWidth, 0],
    });

    return (
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => toggleMenu()}
      >
        <TouchableOpacity
          style={styles.popupMenuOverlay}
          activeOpacity={1}
          onPressOut={() => toggleMenu()}
        >
          <Animated.View
            style={[
              styles.popupMenu,
              { width: menuWidth, transform: [{ translateX: menuTranslateX }] },
            ]}
          >
            <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            {screens.map((screen, ind) => (
              <TouchableOpacity
                key={ind}
                onPress={() => {
                  toggleMenu, handleNavigate(screen.screen);
                }}
                style={styles.menuItem}
              >
                <Icon
                  style={{ textAlign: "center", paddingHorizontal: 10 }}
                  name={screen.icon}
                  size={20}
                  color={colors.textLight}
                />
                <Text style={styles.menuItemText}>{screen.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>VOTING</Text>
      </View>
      {navigation.canGoBack() && (
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      {showMenu && renderPopupMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    height: Platform.OS === "ios" ? 100 : 60,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  menuButton: {
    marginRight: 8,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  popupMenuOverlay: {
    flex: 1,
    backgroundColor: colors.backgroundAccent,
    justifyContent: "flex-end",
  },
  popupMenu: {
    backgroundColor: colors.background,
    elevation: 2,
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: "absolute",
    height: "100%",
    paddingTop: Platform.OS === "ios" ? 40 : 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 0,
    marginRight: -8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  menuItem: {
    borderRadius: 10,
    backgroundColor: colors.backgroundAccent,
    padding: 25,
    margin: 5,
    display: "flex",
    flexDirection: "row",
  },
  menuItemText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "bold",
  },
});
