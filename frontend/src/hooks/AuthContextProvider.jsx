import { useCallback, useEffect, useMemo, useState } from "react";
import { getUser, signOut, updatePreferences } from "../data/repository";
import { setGlobalCurrency } from "../util";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(() => {
    try {
      return localStorage.getItem("privacyMode") === "true";
    } catch {
      return false;
    }
  });

  const getUserCallback = useCallback(async () => {
    const response = await getUser();
    if (response.status === 200) {
      setUser(response.data.user);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getUserCallback();
  }, [getUserCallback]);

  useEffect(() => {
    if (user?.preferences?.currency) {
      setGlobalCurrency(user.preferences.currency);
    }
    if (typeof user?.preferences?.privacyMode === "boolean") {
      setPrivacyMode(user.preferences.privacyMode);
      try {
        localStorage.setItem(
          "privacyMode",
          String(user.preferences.privacyMode)
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [user]);

  const togglePrivacyMode = useCallback(async () => {
    const nextValue = !privacyMode;
    setPrivacyMode(nextValue);
    try {
      localStorage.setItem("privacyMode", String(nextValue));
    } catch {
      // Ignore storage errors
    }

    if (user) {
      setUser(prevUser =>
        prevUser
          ? {
              ...prevUser,
              preferences: {
                ...(prevUser.preferences || {}),
                privacyMode: nextValue,
              },
            }
          : prevUser
      );
      await updatePreferences({ privacyMode: nextValue });
    }
  }, [privacyMode, user]);

  const signInUser = user => {
    setUser(user);
  };
  const signOutUser = () => {
    signOut();
    setUser(null);
  };

  // memoize context
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      privacyMode,
      togglePrivacyMode,
      setUser,
      signInUser,
      signOutUser,
    }),
    [user, loading, privacyMode, togglePrivacyMode]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};

export { AuthContext };
