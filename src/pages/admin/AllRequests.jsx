import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [admins, setAdmins] = useState(["Ali", "Sara", "Ahmed"]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [modalRequest, setModalRequest] = useState(null); // For popup

  useEffect(() => {
    const q = query(
      collection(db, "supportRequests"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const updateRequest = async (id, data) => {
    await updateDoc(doc(db, "supportRequests", id), data);
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      await deleteDoc(doc(db, "supportRequests", id));
      setSelectedRequests(selectedRequests.filter((rid) => rid !== id));
      if (modalRequest?.id === id) setModalRequest(null);
    }
  };

  const toggleSelect = (id) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter((rid) => rid !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const deleteSelected = async () => {
    if (selectedRequests.length === 0) return;
    if (window.confirm(`Delete ${selectedRequests.length} selected requests?`)) {
      for (const id of selectedRequests) {
        await deleteDoc(doc(db, "supportRequests", id));
      }
      setSelectedRequests([]);
      if (selectedRequests.some((id) => modalRequest?.id === id))
        setModalRequest(null);
    }
  };

  const bulkUpdateStatus = async (status) => {
    for (const id of selectedRequests) {
      await updateDoc(doc(db, "supportRequests", id), { status });
    }
  };

  const bulkAssignAdmin = async (admin) => {
    for (const id of selectedRequests) {
      await updateDoc(doc(db, "supportRequests", id), { assignedTo: admin });
    }
  };

  // Filtered & searched requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.issueType.toLowerCase().includes(search.toLowerCase()) ||
      r.device.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Search, Filter & Bulk Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by issue or device"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg text-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {selectedRequests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={deleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Delete Selected ({selectedRequests.length})
            </button>
            <select
              onChange={(e) => bulkUpdateStatus(e.target.value)}
              defaultValue=""
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="" disabled>
                Update Status
              </option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              onChange={(e) => bulkAssignAdmin(e.target.value)}
              defaultValue=""
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="" disabled>
                Assign Admin
              </option>
              {admins.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        filteredRequests.map((r) => (
          <div
            key={r.id}
            className="bg-white border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <input
                type="checkbox"
                checked={selectedRequests.includes(r.id)}
                onChange={() => toggleSelect(r.id)}
                className="h-4 w-4"
              />
              <div>
                <p className="font-medium text-gray-900">{r.issueType}</p>
                <p className="text-gray-500 text-sm">Device: {r.device}</p>
                <p className="text-gray-400 text-xs">
                  {r.createdAt?.seconds
                    ? new Date(r.createdAt.seconds * 1000).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  statusStyles[r.status]
                }`}
              >
                {r.status}
              </span>

              <select
                value={r.status}
                onChange={(e) =>
                  updateRequest(r.id, { status: e.target.value })
                }
                className="text-sm rounded-md border px-2 py-1"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={r.assignedTo || ""}
                onChange={(e) =>
                  updateRequest(r.id, { assignedTo: e.target.value })
                }
                className="text-sm rounded-md border px-2 py-1"
              >
                <option value="">Assign admin</option>
                {admins.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setModalRequest(r)}
                  className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs"
                >
                  View Details
                </button>
                <button
                  onClick={() => deleteRequest(r.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No requests found.</p>
      )}

      {/* Modal Popup */}
      {modalRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md relative">
            <button
              onClick={() => setModalRequest(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">{modalRequest.issueType}</h3>
            <p>
              <strong>Device:</strong> {modalRequest.device}
            </p>
            <p>
              <strong>Description:</strong> {modalRequest.description || "N/A"}
            </p>
            <p>
              <strong>Priority:</strong> {modalRequest.priority || "Normal"}
            </p>
            <p>
              <strong>Reported By:</strong> {modalRequest.reportedBy || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {modalRequest.status}
            </p>
            <p>
              <strong>Assigned To:</strong> {modalRequest.assignedTo || "Unassigned"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRequests;
