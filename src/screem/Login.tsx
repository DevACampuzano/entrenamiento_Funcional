import { useContext, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthStackNative } from "../../App";
import api from "../api";
import { AuthContext } from "../context/userContext";

export interface IErrorLogin {
  error: string;
  motive: string;
  status: number;
  timestamp: Date;
}

export interface IReponderLogin {
  admininfo: Admininfo;
  token: string;
}

export interface Admininfo {
  email: string;
}
type Props = NativeStackScreenProps<AuthStackNative, "Login">;
const Login = ({ navigation }: Props) => {
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "andrescampu3@gmail.com",
    password: "1234",
  });
  const [error, setError] = useState("");

  const handleChange = (value: string, key: string) => {
    setData((state) => ({ ...state, [key]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    const { email, password } = data;

    if (email.trim() === "") {
      setError("Debe ingresar el correo");
      return;
    }
    if (password.trim() === "") {
      setError("Debe ingresar la contraseña");
      return;
    }
    setError("");

    try {
      const response = await api
        .post<IReponderLogin>("auth/login", {
          email,
          password,
        })
        .catch((err) => {
          const errorResponse = err.response.data as IErrorLogin;
          console.log(JSON.stringify(err));
          setError(errorResponse.motive);
        });
      if (response?.data) {
        const data = response.data;
        signIn(data);
      }
    } catch (err) {
      console.log(err);
      setError("Error al iniciar sesión");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Correo"
        value={data.email}
        onChangeText={(value) => handleChange(value, "email")}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Contraseña"
        value={data.password}
        secureTextEntry
        onChangeText={(value) => handleChange(value, "password")}
      />
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.link}>Registrate</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.textError}>{error}</Text>}
      {loading && <ActivityIndicator size={50} color="white" />}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.5}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.textButton}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4287f5",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  textInput: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    color: "#000",
  },
  textButton: {
    fontSize: 20,
    fontWeight: 400,
    color: "#fff",
  },
  button: {
    backgroundColor: "#2f60ad",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  textError: {
    color: "#b82828",
    fontWeight: 700,
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
  },
  row: { width: "80%", paddingVertical: 5 },
});

export default Login;
