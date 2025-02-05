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

// Define routes in a more structured way
const publicRoutes = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "sign-up",
    element: <SignUp />,
  },
  {
    path: "reset",
    element: <Reset />,
  },
];

const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "home", element: <Home /> },
  { path: "section", element: <Section /> },
  { path: "userMarketUpload", element: <UserUploadMarket /> },
  { path: "record", element: <UserMarket /> },
  { path: "product-category", element: <CategoryProduct /> },
  { path: "product/:id", element: <ProductDetails /> },
  { path: "cart", element: <Cart /> },
  { path: "search", element: <SearchProduct /> },
  { path: "wallet", element: <Wallet /> },
  { path: "notifications", element: <Notification /> },
  { path: "profile", element: <Profile /> },
  { path: "settings", element: <Settings /> },
];

const adminRoutes = [
  { path: "all-users", element: <AllUsers /> },
  { path: "all-products", element: <AllProducts /> },
];

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      // Public routes with redirect for logged-in users
      ...publicRoutes.map(route => ({
        path: route.path,
        element: <RedirectIfLoggedIn>{route.element}</RedirectIfLoggedIn>,
      })),
      // Protected routes
      ...protectedRoutes.map(route => ({
        path: route.path,
        element: <ProtectedRoute>{route.element}</ProtectedRoute>,
      })),
      {
        path: "admin-panel",
        element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
        children: adminRoutes.map(route => ({
          path: route.path,
          element: <ProtectedRoute>{route.element}</ProtectedRoute>,
        })),
      },
    ],
  },
]);

export default router;