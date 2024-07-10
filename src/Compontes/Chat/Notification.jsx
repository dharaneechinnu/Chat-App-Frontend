import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContent";
import { unreadNotificationFunc } from "../../Api/Unad";
import moment from "moment";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const { notification,userChats, markAllnotificationAsread, allUsers,markNotificationonRead } = useContext(ChatContext);

    const Unad = unreadNotificationFunc(notification);

    // Modify notification to include senderName
    const modifiedNotification = notification.map((n) => {
        const sender = allUsers.find((u) => u._id === n.senderId);
        const senderName = sender ? sender.name : "Unknown"; // Handle if sender not found

        return {
            ...n,
            senderName: senderName,
        };
    });

    console.log("Unread notifications:", Unad);
    console.log("Modified notifications:", modifiedNotification);

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
                {Unad?.length === 0 ? null : (
                    <span className="notification-count">
                        <span>{Unad?.length}</span>
                    </span>
                )}
            </div>
            {isOpen && (
                <div className="notifications-box">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <div className="mark-as-read" onClick={()=> markAllnotificationAsread(notification)}>Mark all as read</div>
                    </div>
                    {modifiedNotification && modifiedNotification.map((n,index) =>{
                        return <div 
                        key={index}
                         className=
                         {n.isRead ? 'notification':'notification not-read'}
                          onClick={() =>{
                            markNotificationonRead(n,userChats,user,notification)
                        setIsOpen(false)
                        } 
                          }
                           >
                            <span>{`${n.senderName} sent you a new meesage`}</span>
                            <span className="notification-time">{moment(n.date).calendar()}</span>
                        </div>
                    })}
                </div>
            )}
        </div>
    );
};

export default Notification;
