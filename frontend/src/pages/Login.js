import React, { useContext, useState, useEffect } from "react";
import loginicons from "./pfpik.gif";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../Context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state to check login
  const [formSubmitting, setFormSubmitting] = useState(false); // For login form submission
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart, isLoggedIn } = useContext(Context); // Use `isLoggedIn` from context

  useEffect(() => {
    // Redirect if already logged in
    if (isLoggedIn) {
      navigate("/");
    } else {
      setLoading(false); // Set loading to false if not logged in
    }
  }, [isLoggedIn, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUserDetails();
        fetchUserAddToCart();
        navigate("/section");
      } else {
        setErrorMessage(result.message || "Invalid credentials. Please try again.");
        toast.error(result.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <section
      id="login"
      className="min-h-screen bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 flex items-center justify-center"
    >
      <div className="bg-white p-6 w-full max-w-md rounded-2xl shadow-lg">
        <div className="w-20 h-20 mx-auto overflow-hidden rounded-full bg-gray-200">
          <img src={loginicons} alt="Login Icon" />
        </div>

        <form className="pt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold">Email:</label>
            <div className="bg-gray-100 p-2 rounded-lg">
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Password:</label>
            <div className="bg-gray-100 p-2 flex items-center rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                className="w-full bg-transparent outline-none"
                required
              />
              <button
                type="button"
                className="ml-2 text-gray-600 hover:text-gray-800 transition"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <Link
              to="/reset"
              className="block text-right text-sm text-red-600 hover:underline mt-1"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition transform hover:scale-105 disabled:opacity-50"
            disabled={formSubmitting}
          >
            {formSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-red-600">{errorMessage}</div>
        )}

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-blue-500 hover:underline hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
