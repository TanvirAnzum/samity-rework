import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/Overview";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import { onAuthStateChangedListener } from "./firebase/auth";
import useFirebase from "./hooks/useFirebase";
import Loading from "./components/Loading";
import PublicRoute from "./components/PublicRoute";

function App() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const {isLoading, error} = useFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      setUser(currentUser);
      setIsChecking(false);
    });
    return unsubscribe;
  }, []);

  if(isLoading || isChecking)
  {
    return (<Loading />);
  }

  if(error)
  {
    return <p>{error}</p>
  }
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute loggedIn={user ? true : false}>
          <Login />
        </PublicRoute>
        } />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute loggedIn={user ? true : false}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
