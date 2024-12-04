import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackNative } from "../../App";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import Input from "../Components/Input";
import RadioGroup from "react-native-radio-buttons-group";
import DatePicker from "react-native-date-picker";
import api from "../api";
import { formatDate } from "../utils/string";

type Props = NativeStackScreenProps<AuthStackNative, "Register">;

enum Sexo {
  Masculino = "Masculino",
  Femenino = "Femenino",
}

export interface IResponderRegister {
  idUsuario: number;
  username: string;
  fechaCreacion: string;
  imagen: null;
  email: string;
  sexo: string;
  imc: number;
  altura: number;
  pesoActual: number;
  pesoDeseado: number;
  pesoIdeal: number;
  password: string;
  fechaNacimiento: Date;
  planId: null;
}

const Register = ({ navigation }: Props) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    sexo: Sexo.Masculino,
    altura: 0,
    pesoActual: 0,
    pesoDeseado: 0, //
    fechaNacimiento: new Date(),
  });
  const [error, setError] = useState("");

  const handleChange = (value: string, key: string | number) => {
    setData((state) => ({
      ...state,
      [key]: isNaN(parseFloat(value)) ? value : parseFloat(value),
    }));
  };

  const radioButtons = useMemo(
    () => [
      {
        id: Sexo.Masculino,
        label: "Masculino",
        value: Sexo.Masculino,
        color: "#fff",
        labelStyle: { color: "#fff" },
      },
      {
        id: Sexo.Femenino,
        label: "Femenino",
        value: Sexo.Femenino,
        color: "#fff",
        labelStyle: { color: "#fff" },
      },
    ],
    []
  );
  const handleRegister = async () => {
    const { username, email, password, sexo, altura, pesoActual } = data;
    if (!username || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (altura === 0 || pesoActual.toString() === "") {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");

    try {
      const response = await api
        .post<IResponderRegister>("auth/register", data)
        .catch((err) => {
          setError("Error al registrar");
        });
      if (response?.status === 200) {
        Alert.alert("Usuario registrado", "Usuario registrado correctamente");
        navigation.pop();
      }
      console.log(response);
    } catch (error) {
      setError("Error al registrar");
    }
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => navigation.pop()}
            >
              <Text style={styles.link}>atras</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Registro de Usuario</Text>
          </View>

          <Input
            label="Nombre"
            value={data.username}
            name="username"
            onChange={handleChange}
          />
          <Input
            label="Correo"
            value={data.email}
            name="email"
            onChange={handleChange}
            keyboardType="email-address"
          />
          <View
            style={{
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Text style={{ color: "#fff" }}>Fecha de nacimiento:</Text>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={() => setOpen(true)}
            >
              <Text style={styles.textButton}>
                {formatDate(data.fechaNacimiento)}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              locale="es"
              open={open}
              mode="date"
              title="Selecciona tu fecha de nacimiento"
              date={data.fechaNacimiento}
              onConfirm={(date) => {
                setOpen(false);
                setData((state) => ({ ...state, fechaNacimiento: date }));
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <Input
            label="Contraseña"
            value={data.password}
            name="password"
            onChange={handleChange}
            isPassword
          />

          <View
            style={{
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Text style={{ color: "#fff" }}>Sexo:</Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={(v) => handleChange(v, "sexo")}
              selectedId={data.sexo}
              layout="row"
            />
          </View>

          <Input
            label="Estatura"
            value={data.altura.toString()}
            name="altura"
            onChange={handleChange}
            keyboardType="numeric"
          />
          <Input
            label="Peso Actual"
            value={data.pesoActual.toString()}
            name="pesoActual"
            onChange={handleChange}
            keyboardType="numeric"
          />
          <Input
            label="Peso Deseado"
            value={data.pesoDeseado.toString()}
            name="pesoDeseado"
            onChange={handleChange}
            keyboardType="numeric"
          />

          {error && <Text style={styles.textError}>{error}</Text>}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={handleRegister}
          >
            <Text style={styles.textButton}>Registrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
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
    paddingHorizontal: 40,
    paddingBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    width: "100%",
    textAlign: "left",
  },
  textButton: {
    fontSize: 20,
    fontWeight: 400,
    color: "#fff",
    width: "100%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2f60ad",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textError: {
    color: "#b82828",
    fontWeight: 700,
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});
export default Register;
