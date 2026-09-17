import { useContext, useEffect, useState } from "react";
import AuthContext from "../hooks/AuthContext";
import {
  updateProfile,
  updatePassword,
  updatePreferences,
  exportUserData,
  deleteAccount,
} from "../data/repository";
import Alert from "./Alert";
import Spinner from "./Spinner";
import Jdenticon from "react-jdenticon";
import { useNavigate } from "react-router-dom";
import { CURRENCIES, getCurrencySymbol } from "../util";
import {
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const { user, setUser, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [profileAlert, setProfileAlert] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordAlert, setPasswordAlert] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Preferences Form State
  const [preferencesData, setPreferencesData] = useState({
    currency: "AUD",
    weekStartsOn: 1,
    dateFormat: "dd/MM/yyyy",
    bufferType: "none",
    bufferValue: 0,
  });
  const [preferencesAlert, setPreferencesAlert] = useState(null);
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  // Danger Zone State
  const [exportLoading, setExportLoading] = useState(false);
  const [exportAlert, setExportAlert] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(null);

  // Sync user state into forms when user is loaded/changed
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });

      if (user.preferences) {
        setPreferencesData({
          currency: user.preferences.currency || "AUD",
          weekStartsOn: user.preferences.weekStartsOn ?? 1,
          dateFormat: user.preferences.dateFormat || "dd/MM/yyyy",
          bufferType: user.preferences.bufferType || "none",
          bufferValue: Number(user.preferences.bufferValue) || 0,
        });
      }
    }
  }, [user]);

  const tabs = [
    {
      id: "profile",
      name: "Profile",
      description: "Manage your personal details and account email.",
      icon: UserCircleIcon,
    },
    {
      id: "security",
      name: "Password & Security",
      description: "Update your password and review account security.",
      icon: KeyIcon,
    },
    {
      id: "preferences",
      name: "Preferences",
      description: "Customize currency, calendar layout, and savings buffer.",
      icon: AdjustmentsHorizontalIcon,
    },
    {
      id: "danger",
      name: "Data & Danger Zone",
      description: "Export your data or permanently delete your account.",
      icon: ExclamationTriangleIcon,
    },
  ];

  const handleProfileChange = e => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileAlert(null);

    const response = await updateProfile(profileData);

    setProfileLoading(false);
    if (response.status === 200) {
      setProfileAlert(response.data.alert);
      if (response.data.user) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data.user,
        }));
      }
    } else {
      setProfileAlert(
        response.data?.alert || {
          type: "danger",
          message: "An unexpected error occurred while updating profile.",
        }
      );
    }
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordAlert(null);

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordLoading(false);
      setPasswordAlert({
        type: "danger",
        message: "New passwords do not match.",
      });
      return;
    }

    const response = await updatePassword(passwordData);

    setPasswordLoading(false);
    if (response.status === 200) {
      setPasswordAlert(response.data.alert);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } else {
      setPasswordAlert(
        response.data?.alert || {
          type: "danger",
          message: "An unexpected error occurred while updating password.",
        }
      );
    }
  };

  const handlePreferencesChange = e => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    } else if (name === "weekStartsOn") {
      parsedValue = parseInt(value, 10);
    }

    setPreferencesData(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handlePreferencesSubmit = async e => {
    e.preventDefault();
    setPreferencesLoading(true);
    setPreferencesAlert(null);

    const response = await updatePreferences({
      ...preferencesData,
      bufferValue:
        preferencesData.bufferType === "none"
          ? 0
          : Number(preferencesData.bufferValue) || 0,
    });

    setPreferencesLoading(false);
    if (response.status === 200) {
      setPreferencesAlert(response.data.alert);
      if (response.data.preferences) {
        setUser(prevUser => ({
          ...prevUser,
          preferences: response.data.preferences,
        }));
      }
    } else {
      setPreferencesAlert(
        response.data?.alert || {
          type: "danger",
          message: "An unexpected error occurred while updating preferences.",
        }
      );
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    setExportAlert(null);

    const response = await exportUserData();

    setExportLoading(false);
    if (response.status === 200) {
      try {
        const jsonStr = JSON.stringify(response.data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStr = new Date().toISOString().split("T")[0];
        link.href = url;
        link.download = `billmanager-backup-${dateStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setExportAlert({
          type: "success",
          message: "Your backup file has been generated and downloaded.",
        });
      } catch (err) {
        console.error(err);
        setExportAlert({
          type: "danger",
          message: "Failed to download backup file.",
        });
      }
    } else {
      setExportAlert(
        response.data?.alert || {
          type: "danger",
          message: "Failed to export account data.",
        }
      );
    }
  };

  const handleDeleteAccount = async e => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteAlert(null);

    const response = await deleteAccount({ password: deletePassword });

    setDeleteLoading(false);
    if (response.status === 200) {
      signOutUser();
      navigate("/", { replace: true });
    } else {
      setDeleteAlert(
        response.data?.alert || {
          type: "danger",
          message: "Incorrect password or failed to delete account.",
        }
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile information, preferences, security, and data.
        </p>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar Navigation */}
        <aside className="py-2 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setProfileAlert(null);
                    setPasswordAlert(null);
                    setPreferencesAlert(null);
                    setExportAlert(null);
                    setDeleteAlert(null);
                  }}
                  className={classNames(
                    isCurrent
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex w-full items-center border-l-4 px-3 py-2.5 text-sm font-medium transition-colors"
                  )}
                  aria-current={isCurrent ? "page" : undefined}>
                  <Icon
                    className={classNames(
                      isCurrent
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "-ml-1 mr-3 h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <div className="mt-6 lg:col-span-9 lg:mt-0">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold leading-6 text-gray-900">
                  Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your public name and email address associated with your
                  account.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                {profileAlert && (
                  <Alert
                    className="mb-6"
                    type={profileAlert.type}
                    heading={profileAlert.heading}
                    message={profileAlert.message}
                    list={profileAlert.list}
                    buttons={profileAlert.buttons}
                  />
                )}

                {/* Avatar Preview */}
                <div className="mb-8 flex items-center gap-x-5">
                  <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-gray-100 ring-offset-2">
                    <Jdenticon value={profileData.email || "user"} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Avatar Identicon
                    </h3>
                    <p className="text-xs text-gray-500">
                      Generated automatically based on your email address.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        Full Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          required
                          placeholder="Jane Doe"
                          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        Email Address
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                          placeholder="jane@example.com"
                          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        This email is used to log into your account and generate
                        your avatar.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-3 border-t border-gray-100 pt-6">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                      {profileLoading ? (
                        <>
                          <Spinner size={4} />
                          <span>Saving...</span>
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PASSWORD & SECURITY TAB */}
          {activeTab === "security" && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold leading-6 text-gray-900">
                  Password & Security
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ensure your account is protected with a strong, secure
                  password.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                {passwordAlert && (
                  <Alert
                    className="mb-6"
                    type={passwordAlert.type}
                    heading={passwordAlert.heading}
                    message={passwordAlert.message}
                    list={passwordAlert.list}
                    buttons={passwordAlert.buttons}
                  />
                )}

                <div className="mb-6 flex items-start gap-3 rounded-lg bg-blue-50/60 p-4 text-blue-900">
                  <ShieldCheckIcon className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <div className="text-xs sm:text-sm leading-relaxed text-blue-700">
                    <span className="font-semibold text-blue-900">
                      Security Tip:
                    </span>{" "}
                    Use at least 8 characters with a blend of letters, numbers,
                    and symbols. Avoid reusing passwords from other services.
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        Current Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          autoComplete="current-password"
                          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        New Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Must be at least 8 characters.
                      </p>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="confirmNewPassword"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        Confirm New Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="confirmNewPassword"
                          id="confirmNewPassword"
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-3 border-t border-gray-100 pt-6">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                      {passwordLoading ? (
                        <>
                          <Spinner size={4} />
                          <span>Updating...</span>
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold leading-6 text-gray-900">
                  App Preferences
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Customize currency, calendar grid layout, and your target
                  savings buffer.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                {preferencesAlert && (
                  <Alert
                    className="mb-6"
                    type={preferencesAlert.type}
                    heading={preferencesAlert.heading}
                    message={preferencesAlert.message}
                    list={preferencesAlert.list}
                    buttons={preferencesAlert.buttons}
                  />
                )}

                <form onSubmit={handlePreferencesSubmit} className="space-y-8">
                  {/* Currency & Layout Section */}
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    {/* Currency Selector */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="currency"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        Display Currency
                      </label>
                      <div className="mt-2">
                        <select
                          id="currency"
                          name="currency"
                          value={preferencesData.currency}
                          onChange={handlePreferencesChange}
                          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                          {Object.entries(CURRENCIES).map(([code, item]) => (
                            <option key={code} value={code}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500">
                        Formats all bill amounts, totals, and input symbols
                        across the app.
                      </p>
                    </div>

                    {/* First Day of Week */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="weekStartsOn"
                        className="block text-sm font-medium leading-6 text-gray-900">
                        Calendar Week Starts On
                      </label>
                      <div className="mt-2">
                        <select
                          id="weekStartsOn"
                          name="weekStartsOn"
                          value={preferencesData.weekStartsOn}
                          onChange={handlePreferencesChange}
                          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                          <option value={1}>Monday (AU / ISO Standard)</option>
                          <option value={0}>Sunday (US Standard)</option>
                        </select>
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500">
                        Adjusts the start column of the month view calendar
                        grid.
                      </p>
                    </div>
                  </div>

                  {/* Target Savings Buffer Section */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Target Savings Buffer
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Add a buffer to your daily target savings to protect
                      against unexpected expenses or minor bill fluctuations.
                    </p>

                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                      {/* Buffer Type */}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="bufferType"
                          className="block text-sm font-medium leading-6 text-gray-900">
                          Buffer Mode
                        </label>
                        <div className="mt-2">
                          <select
                            id="bufferType"
                            name="bufferType"
                            value={preferencesData.bufferType}
                            onChange={handlePreferencesChange}
                            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="none">No Buffer (Exact obligations)</option>
                            <option value="fixed">
                              Fixed Amount ({getCurrencySymbol(preferencesData.currency)})
                            </option>
                            <option value="percentage">
                              Percentage Buffer (%)
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Buffer Value (if active) */}
                      {preferencesData.bufferType !== "none" && (
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="bufferValue"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            {preferencesData.bufferType === "fixed"
                              ? `Fixed Buffer (${getCurrencySymbol(preferencesData.currency)})`
                              : "Percentage Buffer (%)"}
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                {preferencesData.bufferType === "fixed"
                                  ? getCurrencySymbol(preferencesData.currency)
                                  : "%"}
                              </span>
                            </div>
                            <input
                              type="number"
                              name="bufferValue"
                              id="bufferValue"
                              min={0}
                              step={preferencesData.bufferType === "fixed" ? "1" : "0.5"}
                              value={preferencesData.bufferValue}
                              onChange={handlePreferencesChange}
                              className="block w-full rounded-md border-0 py-2 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Buffer Explanatory Box */}
                    {preferencesData.bufferType !== "none" &&
                      preferencesData.bufferValue > 0 && (
                        <div className="mt-4 rounded-lg bg-indigo-50/70 p-4 border border-indigo-100 text-xs sm:text-sm text-indigo-900">
                          <span className="font-semibold">How it works: </span>
                          If your calculated bill obligations for a day are{" "}
                          <span className="font-semibold">
                            {getCurrencySymbol(preferencesData.currency)}500.00
                          </span>
                          , your Target Savings goal will be{" "}
                          <span className="font-semibold text-indigo-700">
                            {getCurrencySymbol(preferencesData.currency)}
                            {preferencesData.bufferType === "fixed"
                              ? (500 + Number(preferencesData.bufferValue)).toFixed(2)
                              : (
                                  500 *
                                  (1 + Number(preferencesData.bufferValue) / 100)
                                ).toFixed(2)}
                          </span>{" "}
                          (including your{" "}
                          {preferencesData.bufferType === "fixed"
                            ? `${getCurrencySymbol(preferencesData.currency)}${Number(preferencesData.bufferValue).toFixed(2)} fixed buffer`
                            : `${preferencesData.bufferValue}% buffer`}
                          ).
                        </div>
                      )}
                  </div>

                  <div className="flex justify-end gap-x-3 border-t border-gray-100 pt-6">
                    <button
                      type="submit"
                      disabled={preferencesLoading}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                      {preferencesLoading ? (
                        <>
                          <Spinner size={4} />
                          <span>Saving...</span>
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DANGER ZONE & DATA TAB */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              {/* Export Data Card */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-5">
                  <h2 className="text-lg font-semibold leading-6 text-gray-900">
                    Export Account Data
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Download a full JSON backup of your account profile, bills,
                    recurring schedules, and paydays.
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  {exportAlert && (
                    <Alert
                      className="mb-6"
                      type={exportAlert.type}
                      heading={exportAlert.heading}
                      message={exportAlert.message}
                    />
                  )}

                  <p className="text-sm text-gray-600 mb-6">
                    Your export file includes all event parameters, recurrence
                    rules (RRules), and preferences formatted for backup or data
                    portability.
                  </p>

                  <button
                    type="button"
                    onClick={handleExportData}
                    disabled={exportLoading}
                    className="inline-flex items-center gap-x-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                    {exportLoading ? (
                      <>
                        <Spinner size={4} />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="h-4 w-4 text-gray-500" />
                        <span>Download Backup (.json)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Delete Account Card */}
              <div className="rounded-xl border border-red-200 bg-red-50/20 shadow-sm">
                <div className="border-b border-red-100 px-6 py-5">
                  <h2 className="text-lg font-semibold leading-6 text-red-900">
                    Danger Zone: Delete Account
                  </h2>
                  <p className="mt-1 text-sm text-red-600">
                    Permanently delete your account and all associated bills and
                    paydays.
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  {deleteAlert && (
                    <Alert
                      className="mb-6"
                      type={deleteAlert.type}
                      heading={deleteAlert.heading}
                      message={deleteAlert.message}
                      list={deleteAlert.list}
                    />
                  )}

                  <p className="text-sm text-gray-600 mb-6">
                    Once your account is deleted, all bills, paydays, and target
                    savings calculations will be permanently wiped from the
                    database. This action cannot be reversed.
                  </p>

                  {!deleteModalOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setDeleteAlert(null);
                        setDeletePassword("");
                      }}
                      className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={handleDeleteAccount}
                      className="rounded-lg border border-red-200 bg-white p-6 max-w-lg space-y-4">
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <h4 className="text-sm font-semibold text-red-900">
                          Confirm Account Deletion
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        Please enter your account password to confirm permanent
                        deletion.
                      </p>

                      <div>
                        <label
                          htmlFor="deletePassword"
                          className="block text-xs font-medium text-gray-700">
                          Account Password
                        </label>
                        <input
                          type="password"
                          id="deletePassword"
                          name="deletePassword"
                          value={deletePassword}
                          onChange={e => setDeletePassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="mt-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="flex items-center gap-x-3 pt-2">
                        <button
                          type="submit"
                          disabled={deleteLoading || !deletePassword}
                          className="inline-flex items-center justify-center rounded-md bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50">
                          {deleteLoading ? (
                            <>
                              <Spinner size={4} />
                              <span>Deleting...</span>
                            </>
                          ) : (
                            "Confirm Permanent Delete"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteModalOpen(false);
                            setDeletePassword("");
                            setDeleteAlert(null);
                          }}
                          className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
