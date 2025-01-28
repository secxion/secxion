import "./App.css";
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
  const [cartProductCount, setCartProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // UseCallback to memoize the function
  const fetchUserDetails = useCallback(async () => {
    try {
      dispatch(setLoading(true)); // Set loading to true while fetching
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          dispatch(setUserDetails(data.data));
        } else {
          dispatch(setUserDetails(null)); // Clear user details on failure
        }
      } else {
        console.error("Failed to fetch user details. Status:", response.status);
        dispatch(setUserDetails(null));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      dispatch(setUserDetails(null));
    } finally {
      dispatch(setLoading(false)); // Ensure loading is set to false
    }
  }, [dispatch]); // Add `dispatch` as a dependency

  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCartProductCount(data?.data?.count || 0); // Update cart count state
      } else {
        console.error("Failed to fetch cart product count. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching cart product count:", error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([fetchUserDetails(), fetchUserAddToCart()]);
      setIsLoading(false); // Ensure `isLoading` is set to false
    };

    initializeApp();
  }, [fetchUserDetails]); // Add fetchUserDetails to the dependencies array

  if (isLoading) {
    // Show a loading spinner while initializing
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
      }}
    >
      {/* Responsive Navigation Header */}
      <Header />
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* Toast Container for Notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={2000} // Set auto-close to 2 seconds
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
