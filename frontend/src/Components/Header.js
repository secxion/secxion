import React, { useContext, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { PiUserSquare } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import ROLE from "../common/role";

const Header = () => {
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/login");
    } else if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <nav className="h-14 shadow-md bg-gray-200 fixed w-full z-50">
      <div className="h-full container mx-auto flex items-center justify-between px-4">
        {/* Unique Home Icon */}
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
              <path d="M3 9.5L12 3l9 6.5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11z" fill="#8B5CF6" />
              <rect x="10" y="14" width="4" height="6" fill="#FACC15" />
              <path d="M3 9.5L12 3l9 6.5" stroke="#8B5CF6" strokeWidth="2" />
            </svg>
          </Link>
        </div>

        {/* Search Bar for Desktop */}
        {user?._id && (
          <div className="hidden md:flex items-center w-full max-w-sm relative">
            <input
              type="text"
              placeholder="Search Trade..."
              className="w-full px-3 py-2 rounded-full outline-none focus:ring-2 focus:ring-purple-700 bg-gray-100"
              onChange={handleSearch}
              value={search}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <FcSearch size={22} />
            </div>
          </div>
        )}

        {/* Profile & Logout */}
        <div className="flex items-center gap-6">
          {/* Profile Icon */}
          {user?._id && (
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-14 h-14 object-cover rounded-lg border-4 border-gradient-to-r from-yellow-400 to-red-500 shadow-lg"
                    alt="Profile"
                  />
                ) : (
                  <PiUserSquare size={36} className="text-purple-700" />
                )}
              </div>

              {/* Dropdown Menu */}
              {menuDisplay && (
                <div className="absolute top-12 right-0 w-48 bg-white shadow-md rounded-md overflow-hidden z-50">
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to="/admin-panel/all-products"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuDisplay(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuDisplay(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Logout Button for Large Screens */}
          {user?._id && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center justify-center bg-transparent group"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="#000" />
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

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-700 text-2xl"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar for Mobile View */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-gray-200 z-50">
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-700 text-2xl"
            >
              ✕
            </button>
            <nav className="mt-4">
              <Link to="/home" className="block text-gray-700 py-2">
                Home
              </Link>
              <Link to="/cart" className="block text-gray-700 py-2">
                Cart
              </Link>
              <button
                onClick={handleLogout}
                className="block text-gray-700 py-2 text-left w-full"
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
