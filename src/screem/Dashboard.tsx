import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import { AuthStackNative } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Alimentos from "./Alimentos";
import Dia from "./Dia";
import Plan from "./Plan";
import { Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/userContext";
import RutinaRouter from "./RouterRutinas";

export type DasboardDrawer = {
  Home: undefined;
  Alimentos: undefined;
  Rutina: undefined;
  Plan: undefined;
  Dia: undefined;
  Alimentacion: undefined;
};

export interface IReponderLogin {
  admininfo: Admininfo;
  token: string;
}

export interface Admininfo {
  email: string;
}
const Drawer = createDrawerNavigator<DasboardDrawer>();

type Props = NativeStackScreenProps<AuthStackNative, "Dasboard">;
export const DrawerDasboard = (props: Props) => {
  const { logOut } = useContext(AuthContext);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#3e7cde", elevation: 10 },
        headerTitleStyle: { color: "#fff" },
        headerTintColor: "#fff",
        headerRight: ({ tintColor }) => (
          <TouchableOpacity
            style={{
              padding: 5,
              marginRight: 10,
              borderRadius: 16,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: tintColor,
            }}
            activeOpacity={0.7}
            onPress={logOut}
          >
            <Text style={{ color: tintColor }}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Plan" component={Plan} />
      <Drawer.Screen name="Dia" component={Dia} />
      <Drawer.Screen name="Alimentos" component={Alimentos} />
      <Drawer.Screen name="Rutina" component={RutinaRouter} />
    </Drawer.Navigator>
  );
};

export default DrawerDasboard;
