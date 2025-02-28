import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import axiosInstance from "../../axiosInstance";// Import the Axios instance

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await axiosInstance.get("/api/notifications");
            if (res.status !== 200) {
                throw new Error(res.data.error || "Something went wrong");
            }
            setNotifications(res.data);
        } catch (error) {
            setIsError(true);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNotifications = async () => {
        try {
            const res = await axios.delete("/api/notifications");
            if (res.status !== 200) {
                throw new Error(res.data.error || "Something went wrong");
            }
            toast.success("Notifications deleted successfully");
            fetchNotifications();
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Notifications</p>
                    <div className='dropdown '>
                        <div tabIndex={0} role='button' className='m-1'>
                            <IoSettingsOutline className='w-4' />
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            <li>
                                <a onClick={deleteNotifications}>Delete all notifications</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}
                {!isLoading && notifications.length === 0 && (
                    <div className='text-center p-4 font-bold'>No notifications 🤔</div>
                )}
                {!isLoading && notifications.length > 0 && notifications.map((notification) => (
                    <div className='border-b border-gray-700' key={notification._id}>
                        <div className='flex gap-2 p-4'>
                            {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                            {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                            <Link to={`/profile/${notification.from.username}`}>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img src={notification.from.profileImg || "/avatar-placeholder.png"} />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-bold'>@{notification.from.username}</span>{" "}
                                    {notification.type === "follow" ? "followed you" : "liked your post"}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
                {isError && <p className='text-center my-4 text-red-500'>{error.message}</p>}
            </div>
        </>
    );
};

export default NotificationPage;