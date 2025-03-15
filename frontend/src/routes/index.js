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
import SearchProduct from "../pages/SearchProduct";
import Section from "../pages/Section";
import Profile from "../Components/Profile";
import Settings from "../Components/Settings";
import Wallet from "../Components/Wallet";
import RedirectIfLoggedIn from "../Components/RedirectIfLoggedIn";
import ProtectedRoute from "../Components/ProtectedRoute";
import UserUploadMarket from "../Components/UserUploadMarket";
import UserMarket from "../pages/UserMarket";
import Net from "../Components/Net";
import UsersMarket from "../pages/UsersMarket";
import BlogManagementPage from "../pages/BlogManagement";
import LiveChat from "../pages/LiveChat";
import AdminChat from "../pages/AdminChat";


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
  {
    path:"system-blog",
    element: <Net />
  }
];

const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "home", element: <Home /> },
  { path: "section", element: <Section /> },
  { path: "userMarketUpload", element: <UserUploadMarket /> },
  { path: "record", element: <UserMarket /> },
  { path: "product-category", element: <CategoryProduct /> },
  { path: "product/:id", element: <ProductDetails /> },
  { path: "search", element: <SearchProduct /> },
  { path: "wallet", element: <Wallet /> },
  { path: "profile", element: <Profile /> },
  { path: "settings", element: <Settings /> },
  { path: "chat", element: <LiveChat/>},
];

const adminRoutes = [
  { path: "all-users", element: <AllUsers /> },
  { path: "all-products", element: <AllProducts /> },
  { path: "users-market", element: <UsersMarket /> },
  { path: "system-blog", element: <BlogManagementPage /> },
  { path: "admin-chat", element: <AdminChat /> },

];

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      ...publicRoutes.map(route => ({
        path: route.path,
        element: <RedirectIfLoggedIn>{route.element}</RedirectIfLoggedIn>,
      })),
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