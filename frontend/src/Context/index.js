import { createContext, useState, useEffect, useCallback } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, [token]);

  const login = (userData, userToken) => {
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
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {};
  };

  const fetchUserDetails = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.status === 401) {
        console.warn("🔴 Token expired or invalid. Logging out...");
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("🔴 Error fetching user details:", error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const fetchBlogs = useCallback(async () => {
    if (!token) {
      toast.error("Unauthorized access. Please log in.");
      return;
    }

    try {
      const response = await fetch(SummaryApi.getBlogs.url, {
        method: SummaryApi.getBlogs.method,
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch blogs.");
      }

      setBlogs(data.blogs || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch blogs.");
    }
  }, [token]);

  const isLoggedIn = !!user;

  return (
    <Context.Provider
      value={{ user, token, blogs, login, logout, getAuthHeaders, fetchUserDetails, fetchBlogs, isLoggedIn, loading }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
