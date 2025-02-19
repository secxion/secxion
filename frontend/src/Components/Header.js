import React, { useContext, useState, useMemo } from "react";
import { FcSearch } from "react-icons/fc";
import { PiUserSquare } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import ROLE from "../common/role";
import Net from "./Net";

const Header = () => {
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const context = useContext(Context); 
  const navigate = useNavigate();
  const searchInput = useLocation();
  
  const searchQuery = useMemo(() => {
    const URLSearch = new URLSearchParams(searchInput?.search);
    return URLSearch.get("q") || "";
  }, [searchInput]);

  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`); 
    } else {
      navigate("/search");
    }
  };

  const toggleMenuDisplay = () => setMenuDisplay((prev) => !prev);
  const toggleSidebarOpen = () => setSidebarOpen((prev) => !prev);
  const toggleSearchPanelOpen = () => setSearchPanelOpen((prev) => !prev);

  return (
    <nav className="h-14 shadow-lg bg-gradient-to-r from-gray-200 to-gray-300 fixed w-full z-50 border-b-2 border-gray-400">
      <div className="h-full container mx-auto flex items-center justify-between px-4">

        {user?._id && (
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5L12 3l9 6.5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11z" fill="#4F46E5" />
                <rect x="10" y="14" width="4" height="6" fill="#FBBF24" />
                <path d="M3 9.5L12 3l9 6.5" stroke="#4F46E5" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        )}
        {user?._id && (
          <div className="hidden md:flex items-center w-full max-w-sm relative">
            <input
              type="text"
              placeholder="Search Trade..."
              className="w-full px-3 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-700 bg-gray-100 border border-gray-300 shadow-md"
              onChange={handleSearch}
              value={search}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <FcSearch size={22} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          {user?._id && (
            <div className="relative">
              <div className="cursor-pointer" onClick={toggleMenuDisplay}>
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-14 h-14 object-cover rounded-lg border-4 border-gradient-to-r from-yellow-400 to-red-500 shadow-lg"
                    alt="Profile"
                  />
                ) : (
                  <PiUserSquare size={36} className="text-blue-700" />
                )}
              </div>

              {menuDisplay && (
                <div className="absolute top-12 right-0 w-48 bg-white shadow-md rounded-md overflow-hidden z-50 border border-gray-300">
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to="/admin-panel/all-products"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={toggleMenuDisplay}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenuDisplay}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenuDisplay();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {user?._id && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center justify-center bg-transparent group"
              title="Logout"
              aria-label="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="#1E293B" />
                <path
                  d="M8 12h8m-3-3l3 3-3 3"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2" fill="#FACC15" />
              </svg>
            </button>
          )}
        </div>

        {user?._id && (
          <button
            className="lg:hidden text-gray-700 text-2xl"
            onClick={toggleSidebarOpen}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
      </div>

      {user?._id && (
        <button
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-4 rounded-full shadow-lg md:hidden border border-gray-300"
          onClick={toggleSearchPanelOpen}
          aria-label="Toggle search panel"
        >
          <FcSearch size={28} />
        </button>
      )}

      {searchPanelOpen && (
        <div
          className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-50 md:hidden transition-transform transform translate-y-0 border-t border-gray-300"
        >
          <button
            className="absolute top-4 right-6 z-50 text-gray-700 text-2xl bg-white rounded-full p-6 shadow-md"
            onClick={toggleSearchPanelOpen}
            aria-label="Close search panel"
          >
            ✕
          </button>
          <div className="flex items-center w-full relative mt-6">
            <input
              type="text"
              placeholder="Search Trade..."
              className="w-full px-3 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-700 bg-gray-100 border border-gray-300 shadow-md"
              onChange={handleSearch}
              value={search}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <FcSearch size={22} />
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && user?._id && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-gray-200 z-50 border-r border-gray-400">
          <div className="p-4">
            <button
              onClick={toggleSidebarOpen}
              className="text-gray-700 text-2xl"
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className="mt-4">
              <Link
                to="/home"
                className="block text-gray-700 py-2 hover:bg-gray-100"
                onClick={toggleSidebarOpen}
              >
                Home
              </Link>
              <Link
                to="/cart"
                className="block text-gray-700 py-2 hover:bg-gray-100"
                onClick={toggleSidebarOpen}
              >
                Cart
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebarOpen();
                }}
                className="block text-gray-700 py-2 text-left w-full hover:bg-gray-100"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;