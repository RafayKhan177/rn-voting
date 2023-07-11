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

export default function TopBar() {
  const [showMenu, setShowMenu] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

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
            <TouchableOpacity onPress={toggleMenu} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Option 3</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Voting</Text>
      {showMenu && renderPopupMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2196f3",
    paddingHorizontal: 16,
    height: Platform.OS === "ios" ? 100 : 60,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  menuButton: {
    marginRight: 8,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  popupMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  popupMenu: {
    backgroundColor: "white",
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
  menuItem: {
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    margin: 5,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
