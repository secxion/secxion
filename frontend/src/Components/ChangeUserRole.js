import React, { useState } from 'react';
import ROLE from '../common/role';
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,    
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole, setUserRole] = useState(role);

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value);
    };

    const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: userRole
            })
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        } else {
            toast.error(responseData.message);
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-purple-600 bg-opacity-50'>
            <div className='bg-yellow-600 shadow-md p-6 w-full max-w-sm rounded-lg'>
                <button className='block ml-auto text-2xl text-gray-800 hover:text-red-600' onClick={onClose}>
                    <IoMdClose />
                </button>

                <h1 className='pb-4 text-lg font-medium text-gray-800'>Change User Role</h1>

                <p className='text-gray-700'>Name: {name}</p> 
                <p className='text-gray-700'>Email: {email}</p>              

                <div className='flex items-center justify-between my-4'>
                    <p className='text-gray-700'>Role:</p>  
                    <select className='border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={userRole} onChange={handleOnChangeSelect}>
                        {Object.values(ROLE).map(el => (
                            <option value={el} key={el}>{el}</option>
                        ))}
                    </select>
                </div>

                <button className='w-fit mx-auto block py-2 px-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition' onClick={updateUserRole}>
                    Change Role
                </button>
            </div>
        </div>
    );
};

export default ChangeUserRole;