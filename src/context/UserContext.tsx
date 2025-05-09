import {
  FC,
  useState,
  createContext,
  Context,
  ReactNode,
  useEffect,
} from "react";
import Storage from "@/lib/Storage";
interface User {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export enum ContextType {
  ADMIN = "admin-context",
  STUDENT = "student-context",
}

interface Auth {
  user: User;
  role: "admin" | "student";
  type: ContextType | undefined;
}

const initialUserState: User = {
  id: "",
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
};

const initialAuth: Auth = {
  user: initialUserState,
  role: "student",
  type: undefined,
};

type Props = {
  children: ReactNode;
};

type LoginPayload = {
  user: string;
  refresh_token: string;
  type: ContextType;
  role: "admin" | "student";
};

export type UserContextType = {
  isLoggedIn: () => boolean;
  logout: () => void;
  login: (payload: LoginPayload) => void;
  auth: Auth;
};

const UserContext: Context<UserContextType | null> =
  createContext<UserContextType | null>(null);

export const UserContextProvider: FC<Props> = ({ children }: Props) => {
  const [refreshAccess, setRefreshAccess] = useState(false);
  const [auth, setAuth] = useState<Auth>(initialAuth);

  const getTokens = (): { accessToken: string; refreshToken: string } => {
    return {
      accessToken:
        Storage.get("access_token") || Storage.get("accessToken") || "",
      refreshToken:
        Storage.get("refresh_token") || Storage.get("refreshToken") || "",
    };
  };

  const decodeJWT = (
    jwt: string,
    type: ContextType,
    role: "admin" | "student"
  ): Auth => {
    const tokenParts = jwt.split(".");
    if (tokenParts.length < 2) {
      throw new Error("Invalid token format");
    }
    const token = tokenParts[1];

    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return { user: payload, type: type, role: role };
  };

  // const setActiveAccount = ({ userId }: { userId: string }) => {
  //   Storage.set("userId", userId);
  //   setRefreshAccess((prevState: boolean) => !prevState);
  //   window.location.replace("/");
  // };

  const isLoggedIn = () => {
    return getTokens().accessToken.length ? true : false;
  };

  const getAuth = () => {
    const auth = Storage.get("auth");
    if (auth) {
      setAuth(auth);
      if (!auth?.role) setAuth((prev) => ({ ...prev, role: "student" }));
    }
    return auth;
  };

  const logout = () => {
    localStorage.clear();
    setRefreshAccess((prevState) => !prevState);
  };

  const login = ({ user, type, role, refresh_token }: LoginPayload) => {
    try {
      const decodedAuth = decodeJWT(user, type, role);
      Storage.set("refreshToken", refresh_token);
      Storage.set("auth", decodedAuth);

      setAuth({
        user: decodedAuth?.user,
        role: role || "student",
        type: type as ContextType,
      });

      setRefreshAccess((prevState) => !prevState);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    getAuth();
  }, [refreshAccess]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        auth,
        logout,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
