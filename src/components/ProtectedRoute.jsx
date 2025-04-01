// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import Loader from "./Loader";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;
//   return user ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// // const ProtectedRoute = ({ children }) => {
// //   const { user, loading } = useAuth();

// //   if (loading) {
// //     return <Loader />;
// //   }

// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;
