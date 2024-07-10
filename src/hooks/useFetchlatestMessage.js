import { useState, useEffect, useContext } from "react";
import { ChatContext } from "../Context/ChatContent";
import Api from "../Api/Api";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        if (!chat?._id) {
            console.warn("No chat ID provided");
            return;
        }

        const getMessage = async () => {
            try {
                const response = await Api.get(`/message/${chat._id}`);

           
                if (Array.isArray(response.data) && response.data.length > 0) {
                  
                    const sortedMessages = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setLatestMessage(sortedMessages[0]);
                } else {
                    setLatestMessage(null);
                }
            } catch (error) {
                console.error("Failed to fetch latest message", error);
            }
        };

        getMessage();
    }, [chat?._id, newMessage, notifications]);

    return latestMessage;
};
