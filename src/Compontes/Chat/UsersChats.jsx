/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { useFetchLatestMessage } from "../../hooks/useFetchlatestMessage";
import Avatar from '../../assets/Avater.svg';
import { unreadNotificationFunc } from "../../Api/Unad";
import { ChatContext } from "../../Context/ChatContent";
import moment from "moment";

// Import your notification sound file
import notificationSoundFile from '../../assets/sound.mp3';

const UsersChats = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipient(chat, user);
    const { onlineuser, notification, markthisnotificationAsread, setnotification } = useContext(ChatContext);
    const fetchedLatestMessage = useFetchLatestMessage(chat);
    const [latestMessage, setLatestMessage] = useState(fetchedLatestMessage || {});
    const [notificationSound] = useState(new Audio(notificationSoundFile)); // Initialize the notification sound

    const Unad = unreadNotificationFunc(notification);
    const thisUserNotification = Unad?.filter(
        (n) => n.senderId === recipientUser?._id
    );
    const isOnline = onlineuser?.some((user) => user?.userId === recipientUser?._id);

    const truncatedText = (text) => {
        if (!text) return '';
        let shortText = text.substring(0, 15); 
        if (text.length > 15) {
            shortText += "...";
        }
        return shortText;
    };

    console.log("Recipient User: ", recipientUser);
    console.log("Latest Message: ", latestMessage);
    console.log("Is Online: ", isOnline);

    const handleUserClick = () => {
        if (thisUserNotification?.length !== 0) {
            markthisnotificationAsread(thisUserNotification, notification, setnotification);
        }
    };

    useEffect(() => {
        setLatestMessage(fetchedLatestMessage || {});
    }, [fetchedLatestMessage]);

    useEffect(() => {
        // Play notification sound when thisUserNotification updates (new notification received)
        if (thisUserNotification?.length > 0) {
            notificationSound.play();
        }
    }, [thisUserNotification, notificationSound]);

    return (
        <>
            <Stack direction="horizontal"
                gap={3}
                className="user-card align-items-center p-2 justify-content-between"
                role="button"
                onClick={handleUserClick}
            >
                <div className="d-flex">
                    <div className="me-2">
                        <img src={Avatar} alt="profile" height="50rem" />
                    </div>
                    <div className="text-content">
                        <div className="name">{recipientUser?.name}</div>
                        <div className="text">
                            {latestMessage.text && (
                                <span>{truncatedText(latestMessage.text)}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    {latestMessage.createdAt && (
                        <div className="date">
                            {moment(latestMessage.createdAt).calendar()}
                        </div>
                    )}
                    {thisUserNotification?.length > 0 && (
                        <div className="this-user-notifications">
                            {thisUserNotification.length}
                        </div>
                    )}
                    <span className={isOnline ? "user-online" : ""}></span>
                </div>
            </Stack>
        </>
    );
};

export default UsersChats;
