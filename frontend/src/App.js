import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect, useState, useCallback } from "react"; 
import SummaryApi from "./common";
import Context from "./Context";
import { useDispatch } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [marketData, setMarketData] = useState([]);

  const fetchUserDetails = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data); // Set user state
          dispatch(setUserDetails(data.data));
        } else {
          setUser(null);
          dispatch(setUserDetails(null));
        }
      } else {
        console.error("Failed to fetch user details. Status:", response.status);
        setUser(null);
        dispatch(setUserDetails(null));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
      dispatch(setUserDetails(null));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(SummaryApi.myMarket.url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        setMarketData(dataResponse.data);
      } else {
        console.error("Market data fetch failed:", dataResponse.message);
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await fetchUserDetails();
      await fetchMarketData();
      setIsLoading(false);
    };

    initializeApp();
  }, [fetchUserDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Context.Provider value={{ fetchUserDetails, fetchMarketData, marketData, user }}> {/* Include user in context */}
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