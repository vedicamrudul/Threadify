import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axiosInstance";

const Posts = ({ feedType, username, userId }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    console.log("feedType", feedType);
    console.log("username", username);
    console.log("userId", userId);

    const getPostEndpoint = () => {
        switch (feedType) {
            case "forYou":
                return "http://localhost:8000/api/posts/getallposts";
            case "following":
                return "http://localhost:8000/api/posts/following";
            case "posts":
                return `http://localhost:8000/api/posts/getuserposts/${username}`;
            case "likes":
                return `http://localhost:8000/api/posts/likes/${userId}`;
            default:
                return "http://localhost:8000/api/posts/getallposts";
        }
    };

    const POST_ENDPOINT = getPostEndpoint();

    const fetchPosts = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await axiosInstance.get(POST_ENDPOINT);
            if (res.status !== 200) {
                throw new Error(res.data.error || "Something went wrong");
            }
            setPosts(res.data);
        } catch (error) {
            setIsError(true);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [feedType, username, userId]);

    return (
        <>
            {isLoading && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && posts.length === 0 && (
                <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
            )}
            {!isLoading && posts.length > 0 && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
            {isError && <p className='text-center my-4 text-red-500'>{error.message}</p>}
        </>
    );
};

export default Posts;