import React, { useState } from 'react';
import loginicons from './pfpik.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setData((prev) => ({
      ...prev,
      profilePic: imagePic
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: "post",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const dataApi = await dataResponse.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message);
      }
    } else {
      toast.error("🔒 Please check password and confirm password");
    }
  };

  return (
    <section id='signup' className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
      <div className='bg-white p-6 w-full max-w-md rounded-2xl shadow-lg'>
        <div className='w-20 h-20 mx-auto overflow-hidden rounded-full bg-gray-200'>
          <img src={data.profilePic || loginicons} alt='Profile Icon' />
        </div>
        <form className='pt-6 flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-gray-700 font-semibold'>Name: 🌟</label>
            <input
              type='text'
              placeholder='Enter your name'
              name='name'
              value={data.name}
              onChange={handleOnChange}
              required
              className='w-full p-2 bg-gray-100 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold'>Email: 📧</label>
            <input
              type='email'
              placeholder='Enter email'
              name='email'
              value={data.email}
              onChange={handleOnChange}
              required
              className='w-full p-2 bg-gray-100 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold'>Password: 🔑</label>
            <div className='flex items-center bg-gray-100 p-2 rounded-lg'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter password'
                value={data.password}
                name='password'
                onChange={handleOnChange}
                required
                className='w-full bg-transparent outline-none'
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className='text-xl'>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className='block text-gray-700 font-semibold'>Confirm Password: 🔒</label>
            <div className='flex items-center bg-gray-100 p-2 rounded-lg'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder='Confirm password'
                value={data.confirmPassword}
                name='confirmPassword'
                onChange={handleOnChange}
                required
                className='w-full bg-transparent outline-none'
              />
              <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className='text-xl'>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition transform hover:scale-105'>
            Sign Up 🚀
          </button>
        </form>
        <p className='my-5 text-center'>
          Already have an account? <Link to={"/login"} className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;