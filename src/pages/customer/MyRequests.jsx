import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
};

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [details, setDetails] = useState(null); // For 3-dot menu
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "supportRequests"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-3xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">My Requests</h3>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven’t submitted any requests yet.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white shadow-sm relative"
              >
                {/* Request info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{r.issueType}</p>
                  <p className="text-gray-500">{r.device}</p>
                  <p className="text-gray-400 text-xs">
                    {r.createdAt?.toDate
                      ? r.createdAt.toDate().toLocaleString()
                      : ""}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${statusStyles[r.status]}`}
                >
                  {r.status}
                </span>

                {/* 3-dot menu */}
                <button
                  onClick={() => setDetails(r)}
                  className="ml-2 text-gray-400 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Details modal */}
        {details && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 relative">
              <button
                onClick={() => setDetails(null)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h4 className="text-lg font-semibold mb-2">{details.issueType}</h4>
              <p>
                <span className="font-medium">Device:</span> {details.device}
              </p>
              <p>
                <span className="font-medium">Status:</span> {details.status}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {details.description || "No description provided"}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Created:{" "}
                {details.createdAt?.toDate
                  ? details.createdAt.toDate().toLocaleString()
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequests;
