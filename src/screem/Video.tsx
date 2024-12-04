//import liraries
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RutinaStackNative } from "./RouterRutinas";
import { WebView } from "react-native-webview";

type Props = NativeStackScreenProps<RutinaStackNative, "video">;
// create a component
const Video: FC<Props> = ({ route, navigation }) => {
  const { url } = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          left: 10,
          padding: 10,
          borderRadius: 16,
          backgroundColor: "#144e82",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: 400,
            textShadowOffset: { width: 4, height: 3 },
            textShadowRadius: 10,
          }}
        >
          Atras
        </Text>
      </TouchableOpacity>
      <WebView style={styles.container} source={{ uri: url }} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default Video;
