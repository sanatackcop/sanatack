// import React, { createContext, useContext, useState, useEffect } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://your-supabase-url.supabase.co";
// const supabaseAnonKey = "your-anon-key";
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// interface UserContextProps {
//   user: any;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const UserContext = createContext<UserContextProps | null>(null);

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const session = supabase.auth.session();
//     setUser(session?.user || null);

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => {
//       authListener?.unsubscribe();
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     const { user, error } = await supabase.auth.signIn({ email, password });
//     if (error) throw error;
//     setUser(user);
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
