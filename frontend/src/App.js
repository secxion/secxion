import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";
import Context from "./Context";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetailsAPI, fetchMarketDataAPI, fetchBlogsAPI } from "./services/apiService";
import "./styles/Loader.css";
import { ChatProvider } from "./Context/chatContext";
import "./App.css";

const Header = lazy(() => import("./Components/Header"));
const Footer = lazy(() => import("./Components/Footer"));
const Net = lazy(() => import("./Components/Net"));
// const Navbar = lazy(() => import("./Components/Navbar"));

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

  const { refetch: fetchUserDetails, isLoading: isUserLoading } = useQuery({
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
          {/* {user && <Navbar />} */}
          {user && <Net blogs={blogs} fetchBlogs={fetchBlogs} />} 
          <main className="min-h-[calc(100vh-120px)] pt-1 mt-6">
            {user && <Header />} 
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
