import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";

const EMPTY_ADDRESS = {
  street: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
};

function Profile() {
  const { user, setUser } = useAuth();

  // Account details state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState({
    ...EMPTY_ADDRESS,
    ...(user?.address || {}),
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Auto-fade success messages after ~2s
  useEffect(() => {
    if (!profileSuccess) return;
    const t = setTimeout(() => setProfileSuccess(""), 2000);
    return () => clearTimeout(t);
  }, [profileSuccess]);

  useEffect(() => {
    if (!passwordSuccess) return;
    const t = setTimeout(() => setPasswordSuccess(""), 2000);
    return () => clearTimeout(t);
  }, [passwordSuccess]);

  const handleAddressChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    setProfileSaving(true);
    try {
      const { data } = await api.put("/auth/profile", {
        name,
        email,
        phone,
        address,
      });
      // Update the auth context so the navbar reflects the new name/email,
      // and sync the local form state to the returned user.
      setUser(data.user);
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setPhone(data.user.phone || "");
      setAddress({ ...EMPTY_ADDRESS, ...(data.user.address || {}) });
      setProfileSuccess("Profile updated");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Unable to update your profile.",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put("/auth/password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Unable to update your password.",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>

      {/* Section 1 — Account Details */}
      <div className={`glass-panel ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Account Details</h2>

        <form className={styles.form} onSubmit={handleProfileSubmit} noValidate>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="street">
                Street
              </label>
              <input
                id="street"
                type="text"
                className={styles.input}
                value={address.street}
                onChange={handleAddressChange("street")}
                placeholder="123 Main St"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                className={styles.input}
                value={address.city}
                onChange={handleAddressChange("city")}
                placeholder="City"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="province">
                Province / State
              </label>
              <input
                id="province"
                type="text"
                className={styles.input}
                value={address.province}
                onChange={handleAddressChange("province")}
                placeholder="Province / State"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                className={styles.input}
                value={address.postalCode}
                onChange={handleAddressChange("postalCode")}
                placeholder="Postal Code"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="country">
                Country
              </label>
              <input
                id="country"
                type="text"
                className={styles.input}
                value={address.country}
                onChange={handleAddressChange("country")}
                placeholder="Country"
              />
            </div>
          </div>

          {profileSuccess && <p className={styles.success}>{profileSuccess}</p>}
          {profileError && <p className={styles.error}>{profileError}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={profileSaving}
          >
            {profileSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Section 2 — Change Password */}
      <div className={`glass-panel ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Change Password</h2>

        <form
          className={styles.form}
          onSubmit={handlePasswordSubmit}
          noValidate
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              className={styles.input}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              className={styles.input}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {passwordSuccess && (
            <p className={styles.success}>{passwordSuccess}</p>
          )}
          {passwordError && <p className={styles.error}>{passwordError}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={passwordSaving}
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
