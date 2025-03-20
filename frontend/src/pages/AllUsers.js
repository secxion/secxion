import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryApi from '../common';
import moment from 'moment';
import { MdModeEdit } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
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

const deleteUsers = async (userIds, refetch, setSelectedUsers) => {
    if (userIds.length === 0) {
        toast.warn("No users selected.");
        return;
    }

    if (!window.confirm("Are you sure you want to delete the selected users?")) return;

    try {
        const response = await fetch(SummaryApi.deleteUser.url, {
            method: SummaryApi.deleteUser.method,
            credentials: 'include',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ userIds })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success("Selected users deleted successfully.");
            refetch(); // Refresh the user list
            setSelectedUsers([]); // Clear selection after deletion
        } else {
            toast.error(responseData.message || "Failed to delete users.");
        }
    } catch (error) {
        toast.error("An error occurred while deleting users.");
    }
};

const AllUsers = () => {
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users

    const { data: allUser = [], isLoading, error, refetch } = useQuery({
        queryKey: ["allUsers"],
        queryFn: fetchAllUsers,
        staleTime: 1000 * 60 * 5,
        retry: 2, 
    });

    // Toggle selection of individual users
    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    // Select/Deselect all users
    const toggleSelectAll = () => {
        if (selectedUsers.length === allUser.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(allUser.map(user => user._id));
        }
    };

    return (
        <div className='bg-white pb-4 h-[calc(100vh-100px)] flex flex-col'>
            {/* Bulk Delete Button */}
            <div className="p-2 bg-gray-200 flex justify-end">
                <button
                    className={`px-4 py-2 rounded ${selectedUsers.length > 0 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    onClick={() => deleteUsers(selectedUsers, refetch, setSelectedUsers)}
                    disabled={selectedUsers.length === 0}
                >
                    Delete Selected
                </button>
            </div>

            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-auto">
                <table className='w-full userTable border-collapse min-w-[800px]'>
                    <thead className="sticky top-0 bg-black text-white text-left z-10">
                        <tr>
                            <th className="p-2">
                                <input 
                                    type="checkbox" 
                                    onChange={toggleSelectAll} 
                                    checked={selectedUsers.length === allUser.length && allUser.length > 0} 
                                />
                            </th>
                            <th className="p-2">#</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Created Date</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">Loading users...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-red-500">Error loading users.</td>
                            </tr>
                        ) : allUser.length > 0 ? (
                            allUser.map((el, index) => (
                                <tr key={el._id} className="hover:bg-gray-100 border-b">
                                    <td className="p-2">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUsers.includes(el._id)} 
                                            onChange={() => toggleUserSelection(el._id)} 
                                        />
                                    </td>
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2 capitalize">{el?.name}</td>
                                    <td className="p-2">{el?.email}</td>
                                    <td className="p-2">{el?.role}</td>
                                    <td className="p-2">{moment(el?.createdAt).format('LL')}</td>
                                    <td className="p-2 text-center flex justify-center gap-2">
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

                                        <button
                                            className='bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition'
                                            onClick={() => deleteUsers([el._id], refetch, setSelectedUsers)}
                                            aria-label="Delete User"
                                        >
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
