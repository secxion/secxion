// index.js
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Reset from "../pages/Reset";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../Components/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import Section from "../pages/Section";
import Notification from "../Components/Notification";
import Profile from "../Components/Profile";
import Settings from "../Components/Settings";
import Wallet from "../Components/Wallet";
import RedirectIfLoggedIn from "../Components/RedirectIfLoggedIn";
import ProtectedRoute from "../Components/ProtectedRoute";
import UserUploadMarket from "../Components/UserUploadMarket";
import UserMarket from "../pages/UserMarket";


const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      // Public routes with redirect for logged-in users
      {
        path: "login",
        element: (
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        ),
      },
      {
        path: "sign-up",
        element: (
          <RedirectIfLoggedIn>
            <SignUp />
          </RedirectIfLoggedIn>
        ),
      },
      {
        path: "reset",
        element: (
          <RedirectIfLoggedIn>
            <Reset />
          </RedirectIfLoggedIn>
        ),
      },

      // Protected routes
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "section",
        element: (
          <ProtectedRoute>
            <Section />
          </ProtectedRoute>
        ),
      },
      {
        path: "userMarketUpload",
        element: (
          <ProtectedRoute>
            <UserUploadMarket />
          </ProtectedRoute>
        ),
      },
      {
        path: "record",
        element: (
          <ProtectedRoute>
            <UserMarket />
          </ProtectedRoute>
        ),
      },
      {
        path: "product-category",
        element: (
          <ProtectedRoute>
            <CategoryProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "product/:id",
        element: (
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <SearchProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "wallet",
        element: (
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-panel",
        element: (
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "all-users",
            element: (
              <ProtectedRoute>
                <AllUsers />
              </ProtectedRoute>
            ),
          },
          {
            path: "all-products",
            element: (
              <ProtectedRoute>
                <AllProducts />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
