import { createContext, useState, useEffect } from "react";
import SummaryApi from "../common"; 

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchUserDetails = async () => {
    if (!token) return;

    try {
      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        headers: getAuthHeaders(),       
        credentials: "include",
      });
    

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUser(data); 
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const isLoggedIn = !!user; 

  return (
    <Context.Provider value={{ user, token, login, logout, getAuthHeaders, fetchUserDetails, isLoggedIn, loading }}>
      {children}
    </Context.Provider>
  );
};

export default Context;