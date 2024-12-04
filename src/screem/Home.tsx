import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState, useContext, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { DasboardDrawer } from "./Dashboard";
import api from "../api";
import { AuthContext } from "../context/userContext";
import Layout from "../Components/Layout";
import { formatDate } from "../utils/string";
import { useFocusEffect } from "@react-navigation/native";

export interface IResponderGetData {
  altura: number;
  email: string;
  fechaCreacion: string;
  fechaNacimiento: string;
  idUsuario: number;
  imc: number;
  pesoActual: number;
  pesoDeseado: number;
  planId: {
    id: number;
  };
  sexo: string;
  username: string;
}

type Props = DrawerScreenProps<DasboardDrawer, "Home">;

const Home = ({ navigation }: Props) => {
  const { state, logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState<IResponderGetData | null>(null);
  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        try {
          if (!state) {
            return;
          }
          const userDataResponder = await api
            .get<IResponderGetData>(
              "auth/getUserData/" + state?.admininfo?.email,
              {
                headers: {
                  authorization: `Bearer ${state?.token}`,
                },
              }
            )
            .catch(async (err) => {
              console.log(err.response.data);
              if (err.response.data.error === "Unauthorized") {
                logOut();
              }
            });

          setDataUser(userDataResponder?.data || null);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      };

      getData();

      navigation.setOptions({
        title: "Inicio",
      });
    }, [])
  );

  return (
    <Layout>
      {loading ? (
        <ActivityIndicator size={50} color="white" />
      ) : (
        <View
          style={{
            padding: 10,
            backgroundColor: "#144e8299",
            borderRadius: 10,
            gap: 10,
            width: "100%",
          }}
        >
          <Text style={{ ...styles.title, textAlign: "left" }}>
            Bienvenido {dataUser?.username} a Entramiento Funcional
          </Text>
          <Text
            style={{
              ...styles.info,
              fontSize: 20,
              marginVertical: 10,
              fontWeight: "bold",
            }}
          >
            Información:
          </Text>
          <Text style={styles.info}> Nombre: {dataUser?.username}</Text>
          <Text style={styles.info}>
            Fecha de nacimiento:{" "}
            {formatDate(
              new Date(dataUser?.fechaNacimiento || "") || new Date()
            )}
          </Text>
          <Text style={styles.info}> IMC: {dataUser?.imc}</Text>
          <Text style={styles.info}> Altura: {dataUser?.altura}</Text>
          <Text style={styles.info}> Peso Actual: {dataUser?.pesoActual}</Text>
          <Text style={styles.info}>Peso Deseado: {dataUser?.pesoDeseado}</Text>
          <Text style={styles.info}>
            Plan: {dataUser?.planId ? dataUser?.planId.id : "Sin plan"}
          </Text>
        </View>
      )}
    </Layout>
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
  },
});

export default Home;
