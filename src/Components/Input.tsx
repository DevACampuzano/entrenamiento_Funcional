/* eslint-disable quotes */
//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";

// create a component
interface IInputProps {
  label: string;
  value: string;
  onChange: (value: string, key: string) => void;
  name: string;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
}
const Input = ({
  label,
  value,
  onChange,
  name,
  isPassword = false,
  keyboardType = "default",
}: IInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.textInput}
        placeholder={label}
        value={value}
        onChangeText={(v) => onChange(v, name)}
        secureTextEntry={isPassword}
        keyboardType={keyboardType}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  textInput: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  label: {
    color: "#fff",
  },
});

export default Input;
