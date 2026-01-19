import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const statusColors = {
  Pending: "#facc15",
  "In Progress": "#3b82f6",
  Completed: "#22c55e",
};

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 🔥 Realtime Firestore listener
  useEffect(() => {
    const q = query(collection(db, "supportRequests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // 🔔 Unread requests
  const unread = requests.filter(r => r.seenByAdmin === false);

  // 🟢 Toggle dropdown and mark unread as read
  const handleNotificationClick = async () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) {
      // mark all unread requests as read
      for (const r of unread) {
        await updateDoc(doc(db, "supportRequests", r.id), { seenByAdmin: true });
      }
    }
  };

  // 📊 Summary counts
  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const inProgress = requests.filter(r => r.status === "In Progress").length;
  const completed = requests.filter(r => r.status === "Completed").length;
  const chartData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  return (
    <div className="space-y-6 relative">
      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Welcome back 👋</h2>

        <div className="relative">
          <button onClick={handleNotificationClick} className="relative px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
            🔔
            {unread.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {unread.length}
              </span>
            )}
          </button>

          {/* 🔔 Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <h4 className="p-3 border-b font-semibold">Recent Requests</h4>
              {requests.slice(0, 10).map(r => (
                <div key={r.id} className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${r.seenByAdmin === false ? "bg-blue-50" : ""}`}>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{r.issueType}</p>
                    {r.seenByAdmin === false && <span className="text-xs text-blue-600 font-semibold">NEW</span>}
                  </div>
                  <p className="text-xs text-gray-500">{r.device}</p>
                  <p className="text-xs text-gray-400">
                    {r.createdAt?.seconds ? new Date(r.createdAt.seconds * 1000).toLocaleString() : ""}
                  </p>
                </div>
              ))}
              {requests.length === 0 && <p className="p-3 text-gray-500 text-sm">No requests yet</p>}
            </div>
          )}
        </div>
      </div>

      {/* 📊 Summary Cards */}
      <div className="grid sm:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-3xl font-semibold mt-2">{total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-semibold mt-2">{pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-3xl font-semibold mt-2">{inProgress}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-semibold mt-2">{completed}</p>
        </div>
      </div>

      {/* 🥧 Pie Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Requests by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={statusColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
