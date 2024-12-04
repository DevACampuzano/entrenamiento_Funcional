import React, { useCallback, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import Layout from "../Components/Layout";
import api from "../api";
import { AuthContext } from "../context/userContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RutinaStackNative } from "./RouterRutinas";

export interface IResponderGetAllRutinas {
  dificultad: string;
  ejercicios: any[];
  id: number;
  nombre: string;
  tiempoDescanso: number;
  tiempoTotal: number;
}

type Props = NativeStackScreenProps<RutinaStackNative, "list">;
const Rutina = ({ navigation, route }: Props) => {
  const [rutina, setRutina] = React.useState<IResponderGetAllRutinas[]>([]);
  const [loading, setLoading] = React.useState(true);

  const {
    state: { token },
    logOut,
  } = useContext(AuthContext);
  const getData = async () => {
    setLoading(true);
    await api
      .get<IResponderGetAllRutinas[]>("/rutina/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data) {
          setRutina(data || []);
        }
      })
      .catch((err) => {
        if (err.response.data.error === "Unauthorized") {
          logOut();
        }
      });
    setLoading(false);
  };
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getData}
            tintColor="#fff"
          />
        }
        data={rutina}
        style={{ padding: 10, width: "100%" }}
        renderItem={(data) => (
          <Card
            {...data.item}
            onPress={(idRutina) =>
              navigation.navigate("listEjercicios", { idRutina })
            }
          />
        )}
        keyExtractor={(e) => `${e.id}`}
        ListEmptyComponent={() => (
          <Text style={styles.title}>No se encontraron rutinas</Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  );
};

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
  btn: { padding: 5, backgroundColor: "#ffffff80", borderRadius: 16 },
});

interface ICard extends IResponderGetAllRutinas {
  onPress: (id: number) => void;
}
const Card = ({
  nombre,
  tiempoDescanso,
  tiempoTotal,
  dificultad,
  ejercicios,
  id,
  onPress,
}: ICard) => (
  <View
    style={{
      padding: 10,
      backgroundColor: "#144e8299",
      borderRadius: 10,
      gap: 10,
      width: "100%",
    }}
  >
    <Text style={styles.title}>{nombre}</Text>
    <Text style={styles.info}>Dificultad: {dificultad}</Text>
    <Text style={styles.info}>Cantidad de ejercicios: {ejercicios.length}</Text>
    <Text style={styles.info}>Tiempo de descanso: {tiempoDescanso}</Text>
    <Text style={styles.info}>Tiempo de total: {tiempoTotal}</Text>
    <TouchableOpacity style={styles.btn} onPress={() => onPress(id)}>
      <Text style={[styles.info, { textAlign: "center" }]}>Ver Ejercicios</Text>
    </TouchableOpacity>
  </View>
);

export default Rutina;
