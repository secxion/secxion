import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from 'react-icons/fa6';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [navigate, user]);

    const renderProfilePic = () => {
        return user?.profilePic ? (
            <img src={user.profilePic} className='w-24 h-24 rounded-full shadow-lg border-2 border-gray-300' alt={user.name} />
        ) : (
            <FaRegCircleUser className='text-6xl text-gray-500' />
        );
    };

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-[#EDE6D2]'>
            <aside className='bg-white min-h-full w-full md:w-1/4 shadow-lg rounded-lg p-6'>
                <div className='h-36 flex justify-center items-center flex-col'>
                    <div className='cursor-pointer relative flex justify-center'>
                        {renderProfilePic()}
                    </div>
                    <p className='capitalize text-2xl font-bold text-gray-800 mt-2'>{user?.name}</p>
                    <p className='text-sm text-gray-600'>{user?.role}</p>
                </div>

                <nav className='mt-6'>
                    <Link to={"all-users"} className='block px-5 py-3 text-gray-700 hover:bg-gray-200 rounded transition duration-200 text-lg'>All Users</Link>
                    <Link to={"all-products"} className='block px-5 py-3 text-gray-700 hover:bg-gray-200 rounded transition duration-200 text-lg'>All Products</Link>
                </nav>
            </aside>

            <main className='flex-1 p-6 overflow-y-auto bg-white rounded-lg shadow-lg'>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminPanel;