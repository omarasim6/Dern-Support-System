import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Auth pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

// Layouts
import CustomerLayout from "./pages/customer/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Customer pages
import CustomerDashboard from "./pages/CustomerDashboard";
import NewRequest from "./pages/customer/NewRequest";
import MyRequests from "./pages/customer/MyRequests";
import KnowledgeBase from "./pages/customer/KnowledgeBase";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllRequests from "./pages/admin/AllRequests";
import Profile from "./pages/admin/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={role === "admin" ? "/admin" : "/customer"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/register"
          element={user ? <Navigate to={role === "admin" ? "/admin" : "/customer"} /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to={role === "admin" ? "/admin" : "/customer"} /> : <Login />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={user && role === "admin" ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<AllRequests />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Customer routes */}
        <Route
          path="/customer"
          element={user && role === "customer" ? <CustomerLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="new" element={<NewRequest />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="profile" element={<Profile />} />  {/* This renders your Profile page */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
