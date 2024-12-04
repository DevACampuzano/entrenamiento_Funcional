import React, { useContext, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { DasboardDrawer } from "./Dashboard";
import { DrawerScreenProps } from "@react-navigation/drawer";
import Layout from "../Components/Layout";
import api from "../api";
import { AuthContext } from "../context/userContext";
type Props = DrawerScreenProps<DasboardDrawer, "Alimentos">;

export interface IResponderAlimentoGetAll {
  cantidad: number;
  carbohidratos: number;
  //dias:          any[];
  fibra: number;
  grasa: number;
  id: number;
  kilocalorias: number;
  nombre: string;
  proteina: number;
}

const Alimentos = () => {
  const [data, setData] = React.useState<IResponderAlimentoGetAll[]>([]);
  const [loading, setLoading] = React.useState(true);
  const {
    state: { token },
    logOut,
  } = useContext(AuthContext);
  const getData = async () => {
    setLoading(() => true);
    try {
      const responder = await api.get<IResponderAlimentoGetAll[]>(
        "alimento/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (responder.data.length > 0) {
        setData(responder.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(() => false);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout stylesContainer={{ paddingTop: 5 }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getData}
            tintColor="#fff"
          />
        }
        data={data}
        style={{ padding: 10, width: "100%" }}
        renderItem={(data) => <Card data={data.item} />}
        keyExtractor={(e) => `${e.id}`}
        ListEmptyComponent={() => (
          <Text style={styles.title}>No se encontraron alimentos</Text>
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
});

const Card = ({ data }: { data: IResponderAlimentoGetAll }) => {
  return (
    <View
      style={{
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: "#144e8299",
        borderRadius: 10,
        gap: 10,
        marginBottom: 10,
      }}
    >
      <Text style={styles.title}>
        {data.id} - {data.nombre}
      </Text>
      <Text style={styles.info}>Kilocalorias: {data.kilocalorias}</Text>
      <Text style={styles.info}>Fibra: {data.fibra}</Text>
      <Text style={styles.info}>Carbohidratos: {data.carbohidratos}</Text>
      <Text style={styles.info}>Garbohidratos: {data.grasa}</Text>
      <Text style={styles.info}>Proteina: {data.proteina}</Text>
      <Text style={styles.info}>Cantidad: {data.cantidad}g</Text>
    </View>
  );
};

export default Alimentos;
