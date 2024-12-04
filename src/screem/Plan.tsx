import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DasboardDrawer } from "./Dashboard";
import { DrawerScreenProps } from "@react-navigation/drawer";
import Layout from "../Components/Layout";
import api from "../api";
import { AuthContext } from "../context/userContext";
import { IResponderGetData } from "./Home";
type Props = DrawerScreenProps<DasboardDrawer, "Plan">;

export interface IResponderGetAllPlan {
  carbohidrato: number;
  fibra: number;
  grasa: number;
  id: number;
  kilocalorias: number;
  proteina: number;
}

const Plan = ({}: Props) => {
  const [planes, setPlanes] = React.useState<IResponderGetAllPlan[]>([]);
  const {
    state: { token, admininfo },
    logOut,
  } = useContext(AuthContext);
  const [userData, setUserData] = useState<IResponderGetData | null>(null);
  const [loading, setLoading] = useState(false);

  const select = async (id: number) => {
    setLoading(() => true);
    try {
      const responder = await api.post(
        `plan/select/${id}/${userData?.idUsuario}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (responder.data) {
        const newData = {
          ...userData,
          planId: { id },
          altura: userData?.altura || 0,
          email: userData?.email || "",
          fechaCreacion: userData?.fechaCreacion || "",
          fechaNacimiento: userData?.fechaNacimiento || "",
          idUsuario: userData?.idUsuario || 0,
          imc: userData?.imc || 0,
          pesoActual: userData?.pesoActual || 0,
          pesoDeseado: userData?.pesoDeseado || 0,
          sexo: userData?.sexo || "",
          username: userData?.username || "",
        };
        setUserData(newData);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(() => false);
  };

  const getData = async () => {
    const responder = await api
      .get<IResponderGetAllPlan[]>("plan/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        if (err.response.data.error === "Unauthorized") {
          logOut();
        }
      });
    setPlanes(responder?.data || []);
  };
  useEffect(() => {
    const getDataUser = async () => {
      try {
        if (!token) {
          return;
        }
        const userDataResponder = await api
          .get<IResponderGetData>("auth/getUserData/" + admininfo?.email, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          .catch(async (err) => {
            console.log(err.response.data);
            if (err.response.data.error === "Unauthorized") {
              logOut();
            }
          });

        setUserData(userDataResponder?.data || null);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    getDataUser();
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
        data={planes}
        style={{ padding: 10, width: "100%" }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={(data) => (
          <Card
            plan={data.item}
            planId={userData?.planId?.id}
            onPress={select}
          />
        )}
        keyExtractor={(e) => `${e?.id}`}
        ListEmptyComponent={() => (
          <Text style={styles.title}>No hay planes</Text>
        )}
      />
      {loading ? (
        <ActivityIndicator size={50} color="white" />
      ) : planes.length > 0 ? (
        <Text style={styles.info}>
          Plan seleccionado: {userData?.planId?.id || "Ninguno"}
        </Text>
      ) : (
        <></>
      )}
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
    textAlign: "center",
  },
  btn: { padding: 5, backgroundColor: "#ffffff80", borderRadius: 16 },
});

const Card = ({
  plan,
  planId,
  onPress,
}: {
  plan: IResponderGetAllPlan;
  planId?: number;
  onPress: (id: number) => void;
}): React.JSX.Element => {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#144e8299",
        borderRadius: 10,
        gap: 10,
      }}
    >
      <Text style={styles.title}>Plan {plan?.id}</Text>
      <Text style={styles.info}>Kilocalorias: {plan?.kilocalorias}</Text>
      <Text style={styles.info}>Fibra: {plan?.fibra}</Text>
      <Text style={styles.info}>Grasa: {plan?.grasa}</Text>
      <Text style={styles.info}>Carbohidrato: {plan?.carbohidrato}</Text>
      <Text style={styles.info}>Proteina: {plan?.proteina}</Text>
      {planId !== plan?.id && (
        <TouchableOpacity style={styles.btn} onPress={() => onPress(plan?.id)}>
          <Text style={styles.info}>Elegir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Plan;
