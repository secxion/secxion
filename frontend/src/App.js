import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";
import Context from "./Context";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetailsAPI, fetchMarketDataAPI, fetchBlogsAPI } from "./services/apiService";
import "./styles/Loader.css";
import { ChatProvider } from "./Context/chatContext";

const Header = lazy(() => import("./Components/Header"));
const Footer = lazy(() => import("./Components/Footer"));
const Net = lazy(() => import("./Components/Net"));

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

  const { data: user, refetch: fetchUserDetails, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      dispatch(setLoading(true));
      const res = await fetchUserDetailsAPI();
      dispatch(setLoading(false));

      if (res.success) {
        dispatch(setUserDetails(res.data));
        return res.data;
      } else {
        dispatch(setUserDetails(null));
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: marketData, refetch: fetchMarketData, isLoading: isMarketLoading } = useQuery({
    queryKey: ["marketData"],
    queryFn: fetchMarketDataAPI,
    staleTime: 5 * 60 * 1000,
  });

  const { data: blogs, refetch: fetchBlogs, isLoading: isBlogsLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogsAPI,
    staleTime: 5 * 60 * 1000,
  });

  if (isUserLoading || isMarketLoading || isBlogsLoading) {
    return <Loader />;
  }

  return (
    <ChatProvider>
    <Context.Provider value={{ fetchUserDetails, fetchMarketData, marketData, user, fetchBlogs, blogs }}>
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