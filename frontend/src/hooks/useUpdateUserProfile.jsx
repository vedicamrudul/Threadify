import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../axiosInstance";

const useUpdateUserProfile = () => {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const updateProfile = async (formData) => {
        setIsUpdatingProfile(true);
        try {
            const res = await axiosInstance.patch(`/api/users/updateprofile`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.status !== 200) {
                throw new Error(res.data.error || "Something went wrong");
            }
            toast.success("Profile updated successfully");
            // Optionally, you can invalidate queries or update the state here
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;