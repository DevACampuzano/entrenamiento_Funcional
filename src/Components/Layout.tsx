import React from "react";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface StateProps {
  children?: JSX.Element | JSX.Element[];
  stylesContainer?: StyleProp<ViewStyle>;
}

const Layout = ({ children, stylesContainer }: StateProps) => {
  return (
    <View style={[styles.container, stylesContainer]}>
      <Image
        source={require("../assets/imag_home.png")}
        style={{ position: "absolute", zIndex: 0 }}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4287f5",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
});

export default Layout;
