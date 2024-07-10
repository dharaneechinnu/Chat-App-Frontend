/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Api from "../Api/Api";

export const useFetchRecipient = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const recipientId = chat?.members.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;

            setIsLoading(true);
            try {
                const response = await Api.get(`/auth/find/${recipientId}`);
                setRecipientUser(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, [recipientId]);

    return { recipientUser, error, isLoading };
};
