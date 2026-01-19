import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, updateEmail } from "firebase/auth";

function Profile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Settings state
  const [settingsMode, setSettingsMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [emailData, setEmailData] = useState({ email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdminData(docSnap.data());
        setFormData(docSnap.data());
        setEmailData({ email: docSnap.data().email });
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, formData);
    setAdminData(formData);
    setEditMode(false);
    setMessage("Profile updated successfully!");
  };

  const handlePasswordChange = async () => {
    if (!auth.currentUser) return;
    if (passwordData.newPassword !== passwordData.confirm) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      setPasswordData({ current: "", newPassword: "", confirm: "" });
      setMessage("Password updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEmailChange = async () => {
    if (!auth.currentUser) return;
    try {
      await updateEmail(auth.currentUser, emailData.email);
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { email: emailData.email });
      setAdminData({ ...adminData, email: emailData.email });
      setMessage("Email updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admin Profile</h2>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
              onClick={() => setSettingsMode(!settingsMode)}
            >
              {settingsMode ? "Close Settings" : "Settings"}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="mt-1 border rounded-lg px-3 py-2 w-full text-sm"
              />
            ) : (
              <p className="text-gray-900">{adminData.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{adminData.email}</p>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-gray-900">{adminData.role}</p>
          </div>

          {editMode && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm mt-2"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Settings Section */}
      {settingsMode && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Account Settings</h3>

          {/* Change Password */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Change Password</p>
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirm}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirm: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              Update Password
            </button>
          </div>

          {/* Change Email */}
          <div className="space-y-2 mt-4">
            <p className="text-sm text-gray-500">Change Email</p>
            <input
              type="email"
              value={emailData.email}
              onChange={(e) => setEmailData({ email: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
            <button
              onClick={handleEmailChange}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              Update Email
            </button>
          </div>
        </div>
      )}

      {message && <p className="text-green-600 text-sm">{message}</p>}
    </div>
  );
}

export default Profile;
