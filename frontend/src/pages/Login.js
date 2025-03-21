import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../Context";
import Footer from "../Components/Footer";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUserDetails, isLoggedIn } = useContext(Context);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUserDetails();
        navigate("/");
      } else {
        setErrorMessage(result.message || "Invalid credentials. Please try again.");
        toast.error(result.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section className="w-screen h-screen flex items-center justify-center bg-[#F5F5DC] fixed top-0 left-0 overflow-hidden">
      <div className="bg-white p-8 w-full max-w-md rounded-xl shadow-lg">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700 dark:text-gray-200">
          S
        </div>
        
        {/* Form */}
        <form className="w-full mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <Link to="/reset" className="block text-right text-sm text-blue-500 hover:underline mt-1">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300"
            disabled={formSubmitting}
          >
            {formSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-red-600">{errorMessage}</div>
        )}

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account? {" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
