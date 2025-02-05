import { Outlet } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SummaryApi from "./common";
import Context from "./Context";
import { setUserDetails, setLoading } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });

      const data = response.ok ? await response.json() : null;
      dispatch(setUserDetails(data?.success ? data.data : null));
    } catch (error) {
      console.error("Error fetching user details:", error);
      dispatch(setUserDetails(null));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([fetchUserDetails ()]);
      setIsLoading(false);
    };
    initializeApp();
  }, [fetchUserDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <Context.Provider value={{ fetchUserDetails}}>
      <Header />
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Context.Provider>
  );
}

export default App;
