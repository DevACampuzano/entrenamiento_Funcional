import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import { DasboardDrawer } from "./Dashboard";
import { DrawerScreenProps } from "@react-navigation/drawer";
import Layout from "../Components/Layout";
import api from "../api";
import { AuthContext } from "../context/userContext";
import { IResponderGetData } from "./Home";
import { formatDate } from "../utils/string";
import { IResponderAlimentoGetAll } from "./Alimentos";
import { IResponderGetAllRutinas } from "./Rutina";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export interface IResponderGetAllDia {
  id: number;
  fecha: Date;
  alimentos: Alimento[];
  rutinas: IResponderGetAllRutinas[];
}

export interface Alimento {
  id: number;
  nombre: string;
  kilocalorias: number;
  fibra: number;
  carbohidratos: number;
  grasa: number;
  proteina: number;
  cantidad: number;
}

type Props = DrawerScreenProps<DasboardDrawer, "Dia">;
const Dia = ({ navigation }: Props) => {
  const {
    state: { token, admininfo },
    logOut,
  } = useContext(AuthContext);
  const [dataUser, setDataUser] = useState<IResponderGetData | null>(null);
  const [dias, setDias] = useState<IResponderGetAllDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [alimentos, setAlimentos] = useState<IResponderAlimentoGetAll[]>([]);
  const [rutinas, setRutina] = useState<IResponderGetAllRutinas[]>([]);
  const navigate = useNavigation();

  const createAlimentacion = async () => {
    try {
      const renpoderDia = await api.post(
        `dia/save/${dataUser?.idUsuario}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getDias();
    } catch (err: any) {
      if (err.response.data.error === "Unauthorized") {
        logOut();
      }
    }
  };

  const getDias = async () => {
    setLoading(() => true);
    try {
      const renpoderDia = await api.get<IResponderGetAllDia[]>(
        `dia/getAllDiasByUser/${dataUser?.idUsuario}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sortedDias = renpoderDia.data.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setDias(sortedDias);
    } catch (err: any) {
      if (err.response.data.error === "Unauthorized") {
        logOut();
      }
    }
    setLoading(() => false);
  };

  const getAlimentos = async () => {
    setLoading(() => true);
    try {
      const responder = await api.get<IResponderAlimentoGetAll[]>(
        "alimento/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (responder.data.length > 0) {
        setAlimentos(responder.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(() => false);
  };

  const getRutinas = async () => {
    setLoading(true);
    await api
      .get<IResponderGetAllRutinas[]>(
        "/rutina/getAllbyUser/" + dataUser?.idUsuario,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
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

          setDataUser(userDataResponder?.data || null);
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }, [])
  );

  useEffect(() => {
    if (dataUser !== null) {
      getDias();
      getAlimentos();
      getRutinas();
    }
  }, [dataUser]);

  return (
    <Layout stylesContainer={{ paddingTop: 10 }}>
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          padding: 10,
          paddingHorizontal: 20,
          backgroundColor: "#144e8299",
          borderRadius: 10,
          gap: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getDias}
            tintColor="#fff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>Registro Diario</Text>

          {!dias.some(
            (dia) =>
              new Date(dia.fecha).toDateString() === new Date().toDateString()
          ) && (
            <TouchableOpacity
              style={{
                backgroundColor: "#144e82",
                padding: 10,
                borderRadius: 16,
              }}
              onPress={createAlimentacion}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Crear Registro de hoy
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {dias.map((dia) => (
          <ListDias
            {...dia}
            key={dia.id}
            alimentosList={alimentos}
            rutinasList={rutinas}
            getDias={getDias}
            onRedirect={(idRutina) =>
              navigation.navigate("Rutina", {
                screen: "listEjercicios",
                params: { idRutina },
              })
            }
          />
        ))}
      </ScrollView>
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
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

interface IListDias extends IResponderGetAllDia {
  alimentosList: IResponderAlimentoGetAll[];
  rutinasList: IResponderGetAllRutinas[];
  getDias: () => Promise<void>;
  onRedirect: (onRedirect: number) => void;
}

const ListDias = ({
  id,
  fecha,
  alimentos,
  rutinas,
  alimentosList,
  rutinasList,
  getDias,
  onRedirect,
}: IListDias) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalRutinas, setShowModalRutinas] = useState(false);
  const [idAlimento, setIdAlimento] = useState<number>(0);
  const [idRutina, setIdRutina] = useState<number>(0);
  const {
    state: { token },
  } = useContext(AuthContext);
  useEffect(() => {
    const addAlimento = async () => {
      try {
        await api.put(
          `dia/addAlimentoToDia/${id}/${idAlimento}`,
          { idAlimento },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await getDias();
        setIdAlimento(0);
        setShowModal(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (idAlimento !== 0) {
      addAlimento();
    }
  }, [idAlimento]);

  const deleteAlimentacio = async (idAlimento: number) => {
    try {
      await api.delete(`dia/dropAlimentoToDia/${id}/${idAlimento}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getDias();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRutina = async (idRutina: number) => {
    try {
      await api.delete(`dia/dropRutinaToDia/${id}/${idRutina}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getDias();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const addRutina = async () => {
      try {
        await api.put(
          `dia/addRutinaToDia/${id}/${idRutina}`,
          { idRutina },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await getDias();
        setIdRutina(0);
        setShowModalRutinas(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (idRutina !== 0) {
      addRutina();
    }
  }, [idRutina]);

  return (
    <View
      style={{
        marginVertical: 5,
        borderTopWidth: 1,
        borderStyle: "solid",
        borderColor: "#fff",
      }}
    >
      <Modal animationType="slide" visible={showModal} transparent={true}>
        <TouchableOpacity
          onPress={() => {
            setShowModal(false);
            setIdAlimento(0);
          }}
          style={{ flex: 1 }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              flex: 1,
              backgroundColor: "#00000066",
              zIndex: 20,
            }}
          ></View>
        </TouchableOpacity>
        <View
          style={{
            padding: 10,
            backgroundColor: "#ffffff",
            zIndex: 30,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 16,
            maxHeight: "80%",
            maxWidth: "90%",
          }}
        >
          <ListAlimentos
            alimentos={alimentosList}
            onSelect={(idAlimento) => setIdAlimento(idAlimento)}
          />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        visible={showModalRutinas}
        transparent={true}
      >
        <TouchableOpacity
          onPress={() => {
            setShowModalRutinas(false);
            setIdRutina(0);
          }}
          style={{ flex: 1 }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              flex: 1,
              backgroundColor: "#00000066",
              zIndex: 20,
            }}
          ></View>
        </TouchableOpacity>
        <View
          style={{
            padding: 10,
            backgroundColor: "#ffffff",
            zIndex: 30,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 16,
            maxHeight: "80%",
            maxWidth: "90%",
          }}
        >
          <ListRutinas
            rutinas={rutinasList}
            onSelect={(id) => setIdRutina(id)}
          />
        </View>
      </Modal>
      <Text style={styles.title}>{formatDate(new Date(fecha))}</Text>
      <Text style={styles.subtitle}>Alimentos Consumidos</Text>

      {alimentos.length === 0 && (
        <Text style={styles.info}>* No se han consumido alimentos</Text>
      )}
      {alimentos.map((alimento, i) => (
        <View
          key={i}
          style={{
            marginVertical: 5,
            borderTopWidth: 1,
            borderStyle: "solid",
            borderColor: "#fff",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.info}>Nombre: {alimento.nombre}</Text>
          <Text style={styles.info}>Kilocalorías: {alimento.kilocalorias}</Text>
          <Text style={styles.info}>Fibra: {alimento.fibra}</Text>
          <Text style={styles.info}>
            Carbohidratos: {alimento.carbohidratos}
          </Text>
          <Text style={styles.info}>Grasa: {alimento.grasa}</Text>
          <Text style={styles.info}>Proteína: {alimento.proteina}</Text>
          <Text style={styles.info}>Cantidad: {alimento.cantidad}</Text>
          {new Date(fecha).toDateString() === new Date().toDateString() && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: "#b50707",
                padding: 10,
                borderRadius: 16,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
              onPress={() => deleteAlimentacio(alimento.id)}
            >
              <Text style={styles.info}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {alimentos.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.subtitle}>Total Consumido</Text>
          <Text style={styles.info}>
            Kilocalorías:{" "}
            {alimentos.reduce(
              (acc, alimento) => acc + alimento.kilocalorias,
              0
            )}
          </Text>
          <Text style={styles.info}>
            Fibra:{" "}
            {alimentos.reduce((acc, alimento) => acc + alimento.fibra, 0)}
          </Text>
          <Text style={styles.info}>
            Carbohidratos:{" "}
            {alimentos.reduce(
              (acc, alimento) => acc + alimento.carbohidratos,
              0
            )}
          </Text>
          <Text style={styles.info}>
            Grasa:{" "}
            {alimentos.reduce((acc, alimento) => acc + alimento.grasa, 0)}
          </Text>
          <Text style={styles.info}>
            Proteína:{" "}
            {alimentos.reduce((acc, alimento) => acc + alimento.proteina, 0)}
          </Text>
        </View>
      )}
      <Text style={styles.subtitle}>Rutinas Realizadas</Text>
      {rutinas.length === 0 && (
        <Text style={styles.info}>* No se han realizado rutinas</Text>
      )}
      {rutinas.map((rutina, i) => (
        <View
          key={i}
          style={{
            marginVertical: 5,
            borderTopWidth: 1,
            borderStyle: "solid",
            borderColor: "#fff",
            paddingVertical: 5,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text style={styles.info}>Nombre: {rutina.nombre}</Text>
          <Text style={styles.info}>Dificultad: {rutina.dificultad}</Text>
          <Text style={styles.info}>
            Cantidad de Ejercicios: {rutina.ejercicios.length}
          </Text>
          <Text style={styles.info}>
            Tiempo de descanso: {rutina.tiempoDescanso}
          </Text>
          <Text style={styles.info}>Tiempo total: {rutina.tiempoTotal}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#144e82",
                padding: 10,
                borderRadius: 16,
                marginTop: 10,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{ ...styles.info, textAlign: "center" }}
                onPress={() => onRedirect(rutina.id)}
              >
                Ver Ejercicios
              </Text>
            </TouchableOpacity>
            {new Date(fecha).toDateString() === new Date().toDateString() && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#b50707",
                  padding: 10,
                  borderRadius: 16,
                  marginTop: 10,
                }}
                activeOpacity={0.7}
                onPress={() => deleteRutina(rutina.id)}
              >
                <Text style={{ ...styles.info, textAlign: "center" }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      {rutinas.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.subtitle}>Total Rutinas</Text>
          <Text style={styles.info}>
            Total Ejercicios:{" "}
            {rutinas.reduce((acc, rutina) => acc + rutina.ejercicios.length, 0)}
          </Text>
          <Text style={styles.info}>
            Total Tiempo de Descanso:{" "}
            {rutinas.reduce((acc, rutina) => acc + rutina.tiempoDescanso, 0)}{" "}
            minutos
          </Text>
          <Text style={styles.info}>
            Total Tiempo de Rutinas:{" "}
            {rutinas.reduce((acc, rutina) => acc + rutina.tiempoTotal, 0)}{" "}
            minutos
          </Text>
        </View>
      )}

      {new Date(fecha).toDateString() === new Date().toDateString() && (
        <>
          <TouchableOpacity
            style={{
              backgroundColor: "#144e82",
              padding: 10,
              borderRadius: 16,
              marginTop: 10,
            }}
            onPress={() => setShowModal((s) => !s)}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Agregar Alimento
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#144e82",
              padding: 10,
              borderRadius: 16,
              marginTop: 10,
            }}
            onPress={() => setShowModalRutinas((s) => !s)}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Agregar Rutina
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const ListAlimentos = ({
  alimentos,
  onSelect,
}: {
  alimentos: IResponderAlimentoGetAll[];
  onSelect: (id: number) => void;
}) => {
  return (
    <ScrollView style={{ flex: 1, width: "100%" }}>
      <Text style={{ ...styles.title, color: "#000" }}>Alimentos</Text>
      {alimentos.length === 0 ? (
        <Text style={{ ...styles.info, color: "#000" }}>
          * No se han consumido alimentos
        </Text>
      ) : (
        alimentos.map((alimento) => (
          <View
            key={alimento.id}
            style={{
              marginVertical: 5,
              justifyContent: "center",
              alignItems: "flex-start",
              borderTopWidth: 1,
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            <Text style={{ ...styles.info, color: "#000" }}>
              Nombre: {alimento.nombre}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Kilocalorías: {alimento.kilocalorias}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Fibra: {alimento.fibra}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Carbohidratos: {alimento.carbohidratos}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Grasa: {alimento.grasa}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Proteína: {alimento.proteina}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Cantidad: {alimento.cantidad}
            </Text>
            <TouchableOpacity
              key={alimento.id}
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "#144e82",
                borderRadius: 16,
              }}
              onPress={() => onSelect(alimento.id)}
            >
              <Text style={styles.info}>Selecionar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const ListRutinas = ({
  rutinas,
  onSelect,
}: {
  rutinas: IResponderGetAllRutinas[];
  onSelect: (id: number) => void;
}) => {
  return (
    <ScrollView style={{ flex: 1, width: "100%" }}>
      <Text style={{ ...styles.title, color: "#000" }}>Rutinas</Text>
      {rutinas.length === 0 ? (
        <Text style={{ ...styles.info, color: "#000" }}>
          * No se han consumido alimentos
        </Text>
      ) : (
        rutinas.map((rutina) => (
          <View
            key={rutina.id}
            style={{
              marginVertical: 5,
              justifyContent: "center",
              alignItems: "flex-start",
              borderTopWidth: 1,
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            <Text style={{ ...styles.info, color: "#000" }}>
              Nombre: {rutina.nombre}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Dificultad: {rutina.dificultad}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Tiempo de descanso: {rutina.tiempoDescanso}
            </Text>
            <Text style={{ ...styles.info, color: "#000" }}>
              Tiempo total: {rutina.tiempoTotal}
            </Text>

            <TouchableOpacity
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "#144e82",
                borderRadius: 16,
              }}
              onPress={() => onSelect(rutina.id)}
            >
              <Text style={styles.info}>Selecionar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Dia;
