import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "supportRequests"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allRequests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTotal(allRequests.length);
      setPending(allRequests.filter((r) => r.status === "Pending").length);
      setInProgress(allRequests.filter((r) => r.status === "In Progress").length);
      setResolved(allRequests.filter((r) => r.status === "Resolved").length);

      // Sort by createdAt and take the last 5
      const sorted = allRequests
        .sort((a, b) => (b.createdAt?.toDate() - a.createdAt?.toDate()))
        .slice(0, 5);
      setRecentRequests(sorted);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Welcome back 👋</h2>
        <p className="text-sm text-gray-500 mt-1">
          Live overview of your support requests.
        </p>
      </div>

      {/* Summary Cards */}
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
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-3xl font-semibold mt-2">{resolved}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex space-x-4">
        <button
          onClick={() => navigate("/customer/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit New Request
        </button>
        <button
          onClick={() => navigate("/customer/requests")}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
        >
          View All Requests
        </button>
      </div>
      </div>
  );
}

export default CustomerDashboard;
