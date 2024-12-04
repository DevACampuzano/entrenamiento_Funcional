import "./gesture-handler.native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Dashboard, Login, Register } from "./src/screem";
import { AuthContext, AuthProvider } from "./src/context/userContext";

export interface IReponderLogin {
  admininfo: Admininfo;
  token: string;
}

export interface Admininfo {
  email: string;
}

export type AuthStackNative = {
  Login: undefined;
  Register: undefined;
  Dasboard: undefined;
};

const Stack = createStackNavigator<AuthStackNative>();

export const AppState = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </AuthProvider>
  );
};

function App(): React.JSX.Element {
  const { state } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.token === "" ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <Stack.Screen name="Dasboard" component={Dashboard} />
      )}
    </Stack.Navigator>
  );
}

export default App;
