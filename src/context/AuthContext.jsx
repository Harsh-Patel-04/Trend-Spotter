// // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext({
//   user: null,
//   loading: true,
//   login: () => {},
//   register: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { data } = await axios.get("/api/auth/check");
//         setUser(data.user);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const login = async (credentials) => {
//     const { data } = await axios.post("/api/auth/login", credentials);
//     setUser(data.user);
//   };

//   const register = async (userData) => {
//     const { data } = await axios.post("/api/auth/register", userData);
//     setUser(data.user);
//   };

//   const logout = async () => {
//     await axios.post("/api/auth/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
