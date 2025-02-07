import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../Context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart, isLoggedIn } = useContext(Context);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      setLoading(false);
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
        fetchUserAddToCart();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <section id="login" className="min-h-screen bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 flex items-center justify-center">
      <div className="bg-[#F5F5DC] p-6 w-full max-w-md rounded-2xl shadow-lg"> 
        <div className="w-20 h-20 mx-auto overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="#D8CBAF" /> 
            <text x="50%" y="50%" textAnchor="middle" fill="#4A4A4A" fontSize="40" fontWeight="bold" dy=".3em">S</text> 
          </svg>
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
            <Link to="/reset" className="block text-right text-sm text-red-600 hover:underline mt-1">
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
          <Link to="/sign-up" className="text-blue-500 hover:underline hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;