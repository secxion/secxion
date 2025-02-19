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
            <img 
                src={user.profilePic} 
                className='w-24 h-24 rounded-full shadow-lg border-4 border-gray-200' 
                alt={user.name} 
            />
        ) : (
            <FaRegCircleUser className='text-6xl text-gray-500' />
        );
    };

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-[#FAF3E0]'>
            <aside className='bg-white min-h-screen w-full md:w-1/4 shadow-xl p-6 rounded-r-lg flex flex-col items-center'>
                <div className='h-40 flex flex-col items-center justify-center'>
                    <div className='cursor-pointer relative flex justify-center'>
                        {renderProfilePic()}
                    </div>
                    <p className='capitalize text-xl font-semibold text-gray-800 mt-3'>{user?.name}</p>
                    <p className='text-sm text-gray-500'>{user?.role}</p>
                </div>

                <nav className='mt-8 w-full'>
                    {[
                        { path: "all-users", label: "👥 All Users" },
                        { path: "all-products", label: "📦 All Products" },
                        { path: "users-market", label: "🛒 Users' Market" },
                        { path: "users-reports", label: "📊 Users' Reports" },
                        { path: "users-datapad", label: "📱 Users' Datapad" },
                        { path: "users-wallet", label: "💰 Users' Wallet" },
                        { path: "system-blog", label: "📝 System Blog" }
                    ].map(({ path, label }) => (
                        <Link 
                            key={path} 
                            to={path} 
                            className='flex items-center px-6 py-3 text-gray-700 hover:bg-[#F3E5AB] rounded-lg transition duration-200 text-lg font-medium w-full'>
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className='flex-1 p-8 overflow-y-auto bg-white rounded-l-lg shadow-lg'>
                <h1 className='text-4xl font-bold text-gray-800 mb-6'>Admin Dashboard 🚀</h1>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminPanel;
