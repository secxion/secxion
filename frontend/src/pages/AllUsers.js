import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryApi from '../common';
import moment from 'moment';
import { MdModeEdit } from 'react-icons/md';
import ChangeUserRole from '../Components/ChangeUserRole';

const fetchAllUsers = async () => {
    const response = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include'
    });
    const dataResponse = await response.json();

    if (!response.ok) throw new Error(dataResponse.message || "Failed to fetch users");

    return dataResponse.data;
};

const AllUsers = () => {
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState(null);

    const { data: allUser = [], isLoading, error, refetch } = useQuery({
        queryKey: ["allUsers"],
        queryFn: fetchAllUsers,
        staleTime: 1000 * 60 * 5,
        retry: 2, 
    });

    return (
        <div className='bg-white pb-4 overflow-x-auto'>
            <table className='w-full userTable'>
                <thead>
                    <tr className='bg-black text-white text-left'>
                        <th className="p-2">#</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Created Date</th>
                        <th className="p-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4">Loading users...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-red-500">Error loading users.</td>
                        </tr>
                    ) : allUser.length > 0 ? (
                        allUser.map((el, index) => (
                            <tr key={el._id} className="hover:bg-gray-100">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2 capitalize">{el?.name}</td>
                                <td className="p-2">{el?.email}</td>
                                <td className="p-2">{el?.role}</td>
                                <td className="p-2">{moment(el?.createdAt).format('LL')}</td>
                                <td className="p-2 text-center">
                                    <button
                                        className='bg-green-500 text-white p-2 rounded-full hover:bg-green-700 transition'
                                        onClick={() => {
                                            setUpdateUserDetails(el);
                                            setOpenUpdateRole(true);
                                        }}
                                        aria-label="Edit User Role"
                                    >
                                        <MdModeEdit size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {openUpdateRole && updateUserDetails && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={refetch} 
                />
            )}
        </div>
    );
};

export default AllUsers;
