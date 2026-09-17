import { useContext, useEffect, useState } from "react";
import AuthContext from "../hooks/AuthContext";
import { updateProfile, updatePassword } from "../data/repository";
import Alert from "./Alert";
import Spinner from "./Spinner";
import Jdenticon from "react-jdenticon";
import {
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);

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

  // Sync user state into profileData when user is loaded/changed
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
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

  return (
    <div className="mx-auto max-w-6xl pb-16">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile information, password, and security preferences.
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
        </div>
      </div>
    </div>
  );
}
