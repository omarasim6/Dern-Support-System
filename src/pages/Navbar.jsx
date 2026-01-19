import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
      <Link to="/knowledge-base" style={{ marginRight: "10px" }}>Knowledge Base</Link>
      <Link to="/customer" style={{ marginRight: "10px" }}>Customer Dashboard</Link>
      <Link to="/admin" style={{ marginRight: "10px" }}>Admin Dashboard</Link>
      <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
}

export default Navbar;

