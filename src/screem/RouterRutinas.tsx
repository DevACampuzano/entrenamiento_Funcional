import { DrawerScreenProps } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { DasboardDrawer } from "./Dashboard";
import Rutina from "./Rutina";
import Ejercicios from "./Ejercicios";
import Video from "./Video";

export type RutinaStackNative = {
  list: undefined;
  listEjercicios: { idRutina: number };
  video: { url: string };
};

const Stack = createStackNavigator<RutinaStackNative>();

type Props = DrawerScreenProps<DasboardDrawer, "Rutina">;
const RutinaRouter = ({ route }: Props) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="list"
    >
      <Stack.Screen name="list" component={Rutina} />
      <Stack.Screen name="listEjercicios" component={Ejercicios} />
      <Stack.Screen name="video" component={Video} />
    </Stack.Navigator>
  );
};

export default RutinaRouter;
