import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from 'react-icons/fa6';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && user.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [navigate, user]);

    const renderProfilePic = () => {
        if (!user) return <FaRegCircleUser className='text-6xl text-gray-500 animate-pulse' />;
        
        return user.profilePic ? (
            <img 
                src={user.profilePic} 
                className='w-24 h-24 rounded-full shadow-lg border-4 border-gray-300 object-cover' 
                alt={user.name} 
            />
        ) : (
            <FaRegCircleUser className='text-6xl text-gray-500' />
        );
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    const menuItems = [
        { path: "all-users", label: "👥 All Users" },
        { path: "all-products", label: "📦 All Products" },
        { path: "users-market", label: "🛒 Users' Market" },
        { path: "admin-chat", label: "📊 Chat" },
        { path: "users-datapad", label: "📱 Users' Datapad" },
        { path: "users-wallet", label: "💰 Users' Wallet" },
        { path: "system-blog", label: "📝 System Blog" }
    ];

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-gray-100'>
            {/* Sidebar */}
            <aside className='bg-white min-h-screen md:w-1/4 w-full shadow-lg p-6 rounded-r-lg flex flex-col items-center'>
                <div className='h-40 flex flex-col items-center justify-center'>
                    <div className='cursor-pointer relative flex justify-center'>
                        {renderProfilePic()}
                    </div>
                    <p className='capitalize text-xl font-semibold text-gray-800 mt-3'>{user?.name}</p>
                    <p className='text-sm text-gray-500'>{user?.role}</p>
                </div>

                {/* Navigation */}
                <nav className='mt-8 w-full space-y-2'>
                    {menuItems.map(({ path, label }) => (
                        <Link 
                            key={path} 
                            to={path} 
                            className={`flex items-center px-6 py-3 text-lg font-medium w-full transition duration-200 rounded-lg
                                ${location.pathname.includes(path) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className='flex-1 p-6 md:p-8 overflow-y-auto bg-white rounded-l-lg shadow-lg'>
                <h1 className='text-3xl font-bold text-gray-800 mb-6'>Admin Dashboard 🚀</h1>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminPanel;
