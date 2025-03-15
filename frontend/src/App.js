import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";
import Context from "./Context";
import { fetchUserDetailsAPI, fetchMarketDataAPI, fetchBlogsAPI } from "./services/apiService";
import "./styles/Loader.css";
import { ChatProvider } from "./Context/chatContext";
import { io } from "socket.io-client"; 

const Header = lazy(() => import("./Components/Header"));
const Footer = lazy(() => import("./Components/Footer"));
const Net = lazy(() => import("./Components/Net"));

const SERVER_URL = "https://secxion-f.onrender.com"; 

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading, please wait...</p>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [marketData, setMarketData] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoadingState] = useState(false);
  const [socket, setSocket] = useState(null); 

  const fetchUserDetails = async () => {
    try {
      dispatch(setLoading(true));
      const res = await fetchUserDetailsAPI();
      if (res.success) {
        dispatch(setUserDetails(res.data));
      } else {
        dispatch(setUserDetails(null));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchMarketData = async () => {
    try {
      setLoadingState(true);
      const data = await fetchMarketDataAPI();
      setMarketData(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoadingState(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoadingState(true);
      const data = await fetchBlogsAPI();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchMarketData();
    fetchBlogs();

    const token = localStorage.getItem("token"); 
    if (token) {
      const socketInstance = io(SERVER_URL, {
        auth: { token: `Bearer ${token}` }, 
        transports: ["websocket", "polling"],
      });

      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("🟢 WebSocket Connected:", socketInstance.id);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("🔴 WebSocket Disconnected:", reason);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ChatProvider>
      <Context.Provider value={{ fetchUserDetails, fetchMarketData, marketData, user, fetchBlogs, blogs, socket }}>
        <Suspense fallback={<Loader />}>
          <Net blogs={blogs} fetchBlogs={fetchBlogs} />
          <Header />
          <main className="min-h-[calc(100vh-120px)] pt-16 mt-6">
            <Outlet />
          </main>
          <Footer />
        </Suspense>
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
    </ChatProvider>
  );
}

export default App;
