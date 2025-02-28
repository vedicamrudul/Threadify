import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import axiosInstance from "../../axiosInstance";

const RightPanel = () => {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState("Follow");

    const { follow, isPending } = useFollow();

    const fetchSuggestedUsers = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await axiosInstance.get("http://localhost:8000/api/users/suggested");
            if (res.status !== 200) {
                throw new Error(res.data.error || "Something went wrong!");
            }
            setSuggestedUsers(res.data);
        } catch (error) {
            setIsError(true);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestedUsers();
    }, []);

    if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
                <p className='font-bold'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {/* item */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}
                    {!isLoading &&
                        suggestedUsers?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={user.profileImg || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28'>
                                            {user.fullName}
                                        </span>
                                        <span className='text-sm text-slate-500'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            follow(user._id);
                                            
                                        }}
                                    >
                                        {isPending ? <LoadingSpinner size='sm' /> : isFollowing}
                                    </button>
                                </div>
                            </Link>
                        ))}
                </div>
                {isError && <p className='text-center my-4 text-red-500'>{error.message}</p>}
            </div>
        </div>
    );
};

export default RightPanel;