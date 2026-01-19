import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";

function NewRequest() {
  const [issueType, setIssueType] = useState("");
  const [device, setDevice] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issueType || !device || !description) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setMsg("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in.");

      await addDoc(collection(db, "supportRequests"), {
        issueType,
        device,
        description,
        status: "Pending",
        seenByAdmin: false, // 🔔 unread by admin
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
      });

      setMsg("Request submitted successfully!");
      setIssueType("");
      setDevice("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start md:items-start min-h-[80vh]">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Submit a New Support Request
        </h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {msg && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Issue Type"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
          <input
            type="text"
            placeholder="Device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
          <textarea
            rows={4}
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewRequest;
