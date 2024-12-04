import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export interface IReponderLogin {
  admininfo: Admininfo | null;
  token: string;
}

export interface IContext {
  state: IReponderLogin;
  signIn: (loginData: IReponderLogin) => void;
  logOut: () => void;
}

export interface Admininfo {
  email: string;
}

export const AuthContext = createContext({} as IContext);

const authInicialState: IReponderLogin = {
  token: "",
  admininfo: null,
};

interface ProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: ProviderProps) => {
  const [state, setState] = useState<IReponderLogin>(authInicialState);

  useEffect(() => {
    const getData = async () => {
      const data = (await AsyncStorage.getItem("data")) || "undifined";

      setState(JSON.parse(data));
    };
    getData();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        state,
        signIn: (loginData: IReponderLogin) => {
          setState(loginData);
          AsyncStorage.setItem("data", JSON.stringify(loginData));
        },
        logOut: () => {
          setState(authInicialState);
          AsyncStorage.removeItem("data");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
