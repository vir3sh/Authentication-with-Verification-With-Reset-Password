import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "api/auth/isAuthenticated");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUserData = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/getUserData");
      data.success ? setUserData(data.userData) : toast.error(data.message);
      // console.log(data.userData.name);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getAuthState();
    getUserData();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
