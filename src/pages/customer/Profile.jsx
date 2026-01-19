import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirm: "" });
  const [emailData, setEmailData] = useState({ email: "" });
  const [message, setMessage] = useState("");

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setFormData(docSnap.data());
        setEmailData({ email: docSnap.data().email });
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, formData);
    setUserData(formData);
    setEditMode(false);
    setMessage("Profile updated successfully!");
  };

  const handleEmailChange = async () => {
    if (!auth.currentUser) return;
    try {
      await updateEmail(auth.currentUser, emailData.email);
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { email: emailData.email });
      setUserData({ ...userData, email: emailData.email });
      setMessage("Email updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!auth.currentUser) return;
    if (passwordData.newPassword !== passwordData.confirm) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      setPasswordData({ newPassword: "", confirm: "" });
      setMessage("Password updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="max-w-md bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      {/* Name */}
      <div>
        <p className="text-sm text-gray-500">Full Name</p>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full text-sm mt-1"
          />
        ) : (
          <p className="text-gray-900">{userData.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="text-gray-900">{userData.email}</p>
      </div>

      {/* Role */}
      <div>
        <p className="text-sm text-gray-500">Role</p>
        <p className="text-gray-900">{userData.role || "User"}</p>
      </div>

      {/* Edit / Save buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
        {editMode && (
          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Account Settings */}
      <button
        onClick={() => setSettingsMode(!settingsMode)}
        className="px-4 py-2 bg-gray-100 rounded-lg text-sm w-full text-left"
      >
        {settingsMode ? "Close Settings" : "Account Settings"}
      </button>

      {settingsMode && (
        <div className="space-y-2 mt-2">
          {/* Change Email */}
          <input
            type="email"
            value={emailData.email}
            onChange={(e) => setEmailData({ email: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full text-sm"
            placeholder="Change email"
          />
          <button
            onClick={handleEmailChange}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            Update Email
          </button>

          {/* Change Password */}
          <input
            type="password"
            placeholder="New password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full text-sm"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full text-sm"
          />
          <button
            onClick={handlePasswordChange}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            Update Password
          </button>
        </div>
      )}

      {message && <p className="text-green-600 text-sm">{message}</p>}
    </div>
  );
}

export default Profile;
