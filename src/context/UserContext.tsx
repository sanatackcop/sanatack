import {
  FC,
  useState,
  createContext,
  Context,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import Storage from "@/lib/Storage";
interface User {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isVerify?: boolean;
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
  isVerify: false,
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
  ) => {
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
      const normalizedUser: User = {
        ...initialUserState,
        ...(auth.user || {}),
        isVerify:
          auth.user?.isVerify ??
          auth.user?.email_verified ??
          auth.user?.emailVerified ??
          false,
      };

      setAuth({
        user: normalizedUser,
        role: auth.role || "student",
        type: auth.type,
      });
      if (!auth?.role) setAuth((prev) => ({ ...prev, role: "student" }));
    }
    return auth;
  };

  const logout = () => {
    localStorage.clear();
    setRefreshAccess((prevState) => !prevState);
    window.location.replace("/");
  };

  const login = ({ user, type, role, refresh_token }: LoginPayload) => {
    try {
    const decodedAuth = decodeJWT(user, type, role);
    const payloadUser: any = decodedAuth?.user || {};

    const fullName = [
      payloadUser.firstName,
      payloadUser.lastName,
    ]
      .filter(Boolean)
      .join(" ") || payloadUser.name || "";

    const nameParts = fullName ? fullName.split(" ") : [];
    const derivedFirstName = payloadUser.firstName || nameParts[0] || "";
    const derivedLastName =
      payloadUser.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

    const normalizedUser: User = {
      id:
        payloadUser.id ||
        payloadUser.user_id ||
        payloadUser.uid ||
        payloadUser.sub ||
        "",
      email: payloadUser.email || "",
      firstName: derivedFirstName,
      lastName: derivedLastName,
      mobile: payloadUser.mobile || payloadUser.phone_number || "",
      avatar: payloadUser.avatar || payloadUser.picture || "",
      isVerify:
        payloadUser.isVerify ||
        payloadUser.email_verified ||
        payloadUser.emailVerified ||
        false,
    };

    Storage.set("refreshToken", refresh_token);
    Storage.set("refresh_token", refresh_token);
    Storage.set("access_token", user);
    Storage.set("accessToken", user);
    Storage.set("auth", {
      user: normalizedUser,
      role: role || "student",
      type: type as ContextType,
    });

    setAuth({
      user: normalizedUser,
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

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within a UserContextProvider");
  return context;
};

export default UserContext;
