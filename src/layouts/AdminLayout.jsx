import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "dashboard" },
    { name: "All Requests", path: "requests" },
    { name: "Profile", path: "profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-8 text-gray-900">
          Admin Dashboard
        </h2>

        <nav className="flex-1 space-y-3 text-sm">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
