import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RutinaStackNative } from "./RouterRutinas";
import Layout from "../Components/Layout";
import api from "../api";
import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/userContext";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";

export interface IResponderGetRutina {
  dificultad: string;
  ejercicios: IEjerercicio[];
  id: number;
  nombre: string;
  tiempoDescanso: number;
  tiempoTotal: number;
}

export interface IEjerercicio {
  dificultad: string;
  estiramiento: number;
  id: number;
  idYoutube: string;
  nombre: string;
}

type Props = NativeStackScreenProps<RutinaStackNative, "listEjercicios">;
const Ejercicios = ({ route, navigation }: Props) => {
  const {
    state: { token },
    logOut,
  } = useContext(AuthContext);
  const { idRutina } = route.params;
  const [rutina, setRutina] = useState<IResponderGetRutina | null>(null);

  const getData = async () => {
    await api
      .get<IResponderGetRutina>(`/rutina/${idRutina}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setRutina(data);
      })
      .catch((err) => {
        if (err.response.data.error === "Unauthorized") {
          logOut();
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout stylesContainer={{ alignItems: "flex-start" }}>
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.7}
        onPress={() => navigation.popTo("list")}
      >
        <Text style={styles.info}>Atras</Text>
      </TouchableOpacity>

      <Text style={{ ...styles.title, width: "100%" }}>{rutina?.nombre}</Text>
      <FlatList
        data={rutina?.ejercicios}
        keyExtractor={(item) => `${item.id}`}
        renderItem={(inf) => (
          <EjercicioCard
            ejercicio={inf.item}
            onPress={(url) => navigation.navigate("video", { url })}
          />
        )}
        style={{ width: "100%" }}
      />
    </Layout>
  );
};

interface EjercicioCardProps {
  ejercicio: IEjerercicio;
  onPress: (url: string) => void;
}

const EjercicioCard: FC<EjercicioCardProps> = ({ ejercicio, onPress }) => {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.nombre}>{ejercicio.nombre}</Text>
      <Text style={cardStyles.dificultad}>
        Dificultad: {ejercicio.dificultad}
      </Text>
      <Text style={cardStyles.estiramiento}>
        Estiramiento: {ejercicio.estiramiento} mins
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onPress(ejercicio.idYoutube)}
      >
        <Text style={styles.info}>Ver Video</Text>
      </TouchableOpacity>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "flex-start",
    gap: 5,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dificultad: {
    fontSize: 14,
    color: "#555",
  },
  estiramiento: {
    fontSize: 14,
    color: "#555",
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowOffset: { width: 4, height: 3 },
    textShadowRadius: 10,
  },
  info: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 400,
    textShadowOffset: { width: 4, height: 3 },
    textShadowRadius: 10,
    textAlign: "left",
  },
  btn: { padding: 10, backgroundColor: "#144e82", borderRadius: 16 },
});
export default Ejercicios;
