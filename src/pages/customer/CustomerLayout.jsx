import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";

function CustomerLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "dashboard" },
    { name: "New Request", path: "new" },
    { name: "My Requests", path: "requests" },
    { name: "Knowledge Base", path: "knowledge" },
    { name: "Profile", path: "profile" }, // this will redirect to /customer/profile
  ];  

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 w-64 bg-white border-r border-gray-200
        flex flex-col h-screen p-6
        transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition`}
      >
        <h2 className="text-xl font-semibold mb-8 text-gray-900">
          Customer Dashboard
        </h2>

        <nav className="space-y-3 text-sm flex-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={`/customer/${item.path}`}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
