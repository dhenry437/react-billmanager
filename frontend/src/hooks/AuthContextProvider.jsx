import { useCallback, useEffect, useMemo, useState } from "react";
import { getUser, signOut } from "../data/repository";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setUser,
      signInUser,
      signOutUser,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};

export { AuthContext };
