import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { User } from "../screens/project-list/search-panel";
import { http } from "../utils/http";
import { useMount } from "../utils";

interface AuthForm {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (form: AuthForm) => Promise<void>;
  register: (form: AuthForm) => Promise<void>;
  logout: () => Promise<void>;
}

const BootStrapUser = async (): Promise<User> => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

const AuthContext: React.Context<AuthContextType | undefined> =
  React.createContext<AuthContextType | undefined>(undefined);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // .then(setUser); 与 .then((user) => setUser(user)); 一个意思
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) =>
    auth.register(form).then((user) => setUser(user));
  const logout = () => auth.logout().then(() => setUser(null));
  useMount(() => {
    BootStrapUser().then(setUser);
  });
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必须在 AuthProvider 中使用");
  }
  return context;
};
