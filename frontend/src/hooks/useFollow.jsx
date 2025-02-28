import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useFollow = () => {
    const [isPending, setIsPending] = useState(false);

    const follow = async (userId) => {
        setIsPending(true);
        try {
            const res = await axios.patch(`/api/users/follow/${userId}`);
            if (res.status !== 200) {
                throw new Error(res.data.error || "Something went wrong!");
            }
            toast.success("Followed successfully");
            // Optionally, you can invalidate queries or update the state here
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    };

    return { follow, isPending };
};

export default useFollow;