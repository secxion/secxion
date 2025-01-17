import React, { useContext, useState } from "react";
import Logo from "./Logo";
import { FcSearch } from "react-icons/fc";
import { PiUserSquare } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import ROLE from "../common/role";
import "../App.css"

const Header = () => {
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
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
    }
    if (data.error) {
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
    <>
    
          <nav className="h-14 shadow-emerald-700 shadow-md bg-yellow-600 fixed w-full z-999">
                <div className=" h-full container mx-auto flex items-center px-3 justify-between">
                  {/* <div className=''>
                          <Link to={"/"}> <Logo w={90} h={50}/> </Link>
                      </div> */}

                      <div  className="flex w-full justify-between relative">
                         <div className="">
                    {user?._id ? (
                      <Link to={"home"}>
                        {""}
                        <Logo  />{" "}
                      </Link>
                    ) : (
                      <div className="">
                        <Link to={""}>
                          {" "}
                          <Logo  />{" "}
                        </Link>
                      </div>
                    )}
                  </div>

                  {user?._id && (
                    <div className="hidden lg:flex items-center w-full justify-between max-w-sm outline-none focus-within:shadow pl-2 ">
                      <input
                        type="text"
                        placeholder="Search Trade..."
                        className="w-full outline-none pl-2"
                        onChange={handleSearch}
                        value={search} />
                      <div className="text-lg min-w-[50px] h-8 bg-purple-950 flex items justify-center text-black text cursor-pointer outline-none ">
                        <FcSearch />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-10">
                    <div className="relative flex justify-center">
                      {user?._id && (
                        <div
                          className="text-2xl cursor-pointer relative flex justify-center"
                          onClick={() => setMenuDisplay((preve) => !preve)}
                        >
                          {user?.profilePic ? (
                            <img
                              src={user?.profilePic}
                              className="w-10 h-10 rounded-full"
                              alt={user?.name} />
                          ) : (
                            <PiUserSquare />
                          )}
                        </div>
                      )}

                      {menuDisplay && (
                        <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
                          <nav>
                            {user?.role === ROLE.ADMIN && (
                              <Link
                                to={"/admin-panel/all-products"}
                                className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2"
                                onClick={() => setMenuDisplay((preve) => !preve)}
                              >
                                Admin Panel
                              </Link>
                            )}
                          </nav>
                        </div>
                      )}
                    </div>

                    {user?._id && (
                      <Link to={"/cart"} className="text-2xl relative cursor-pointer">
                        <div className="bg-emerald-700 p-1">
                          <div className="bg-white text-red-400 w-5 h-5 p-2 flex items-center justify-center -top-2.5 -right-2">
                            <p className="font-bold text-sm">
                              {context?.cartProductCount}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )}

                    <div className="">
                      {user?._id && (
                        <><button
                          onClick={handleLogout}
                          className="px-5 py-1 text-white bg-purple-950 hover:bg-black"
                        >
                          Logout
                        </button><div className="flex">
                            <Link
                              to={"/login"}>

                            </Link>
                          </div></>
                      )}
                    </div>
                  </div>
                      </div>

                 
                </div>
              </nav>
    
    
    </>
  );
};
export default Header;
