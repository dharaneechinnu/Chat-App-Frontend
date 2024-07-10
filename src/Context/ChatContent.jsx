/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState, useCallback } from "react";
import api from "../Api/Api";
import {io} from 'socket.io-client'
export const ChatContext = createContext();

// eslint-disable-next-line react/prop-types
export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState([]);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const[currentChat,setcurrentChat] = useState(null)
    const [potentialChats, SetPotentialChats] = useState([])
    const [messages,setmessage] = useState(null);
    const[isMessageLoading,setIsMessageLoading] = useState(false)
    const[messageError,SetMessageError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const[sendtextmessageError,setSendTextMessageError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const[newmessage,setnewmessage] = useState(null)
    const [socket, setSocket] = useState(null);
    const[onlineuser,setonlineUser] = useState([]);
    const[notification,setnotification] = useState([])
    const[allUsers,setAlluser] = useState([])
    console.log("notification : ",notification);

    useEffect(() => {
        const newSocket = io("https://chat-app-backend-bjcp.onrender.com");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

  useEffect(() =>{
    if(socket === null) return;
    socket.emit("addNewUser",user?._id);
    socket.on("getonlineUsers",(res)=>{
          setonlineUser(res)
    });

    return () =>{
        socket.off("getonlineUsers");
    }
  },[socket, user])
// Send Message
useEffect(() => {
    if (socket === null || !newmessage) return;

    const recipientId = currentChat?.members?.find(id => id !== user?._id);
    console.log("Sending message:", { ...newmessage, recipientId });

    socket.emit("sendMessage", { ...newmessage, recipientId });
}, [newmessage, currentChat, user, socket]);

// Received message 
useEffect(() => {
    if (!socket) return;

    socket.on("getmessage", (message) => {
        console.log("Message received:", message);

        // Check if the received message belongs to the current chat
        if (currentChat && message.chatId === currentChat._id) {
            setmessage(prevMessages => [...prevMessages, message]);
        }
    });

    
    socket.on("getnotification",(res) =>{
        const isChatOpen = currentChat?.members.some(id => id === res.senderId)

        if(isChatOpen){
            setnotification(prev => [{...res,isRead:true},...prev])
        }
        else{
            setnotification(prev => [res,...prev])
        }
    })


    return () => {
        console.log("Cleaning up socket listeners");
        socket.off("getmessage");
        socket.off("getnotification");
    };
}, [currentChat, socket]);


    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await api.get('/auth');
                const users = response.data;
    
                if (!Array.isArray(users)) {
                    return console.error("Unexpected response format:", response);
                }
    
                const pChats = users.filter((u) => {
                    let isChatCreated = false;
    
                    // eslint-disable-next-line react/prop-types
                    if (user._id === u._id) return false;
    
                    if (userChats) {
                        isChatCreated = userChats.some((chat) => {
                            return chat.members.includes(u._id);
                        });
                    }
    
                    return !isChatCreated;
                });
    
                SetPotentialChats(pChats);
                setAlluser(response.data)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
    
        getUsers();
    }, [user, userChats]);
    

 useEffect(() =>{
    const getUserChats = async () => {
        // eslint-disable-next-line react/prop-types
        if (user?._id) {
            setIsUserChatLoading(true);
            try {
                // eslint-disable-next-line react/prop-types
                const response = await api.get(`/chat/${user._id}`);
                setUserChats(response.data);
                setIsUserChatLoading(false);
            } catch (error) {
                setUserChatsError(error);
                setIsUserChatLoading(false);
            }
        }
    } 
    getUserChats()
 },[user,notification])
   

 useEffect(() => {
    const fetchMessages = async () => {
        if (!currentChat?._id) return;
        setIsMessageLoading(true);
        try {

            const response = await api.get(`/message/${currentChat._id}`);
            setmessage(response.data);
        } catch (error) {
            SetMessageError(error);
        } finally {
            setIsMessageLoading(false);
        }
    };

    fetchMessages();
}, [currentChat]);

  
const sendtextmessage = useCallback(async(textmessage,sender,currentchatId,settextmessage)=>{
     
   if(!textmessage) return alert("type somethings..")

    const response = await api.post('/message',{
        chatId:currentchatId,
        senderId:sender._id,
        text:textmessage
    }) 
    setnewmessage(response.data);
    if(response.error){
        return setSendTextMessageError(response);
    }
   
       
        setmessage((prev)=> [...prev,response.data]);
        settextmessage("");
    

},[])
  

    const updataCurrentChat = useCallback((chat)=>{
       setcurrentChat(chat)
       console.log(currentChat)
    },[currentChat])


    
    const createChat = async (firstId, secondId) => {
        try {
            const response = await api.post("/chat", { firstId, secondId });
            setUserChats((prevChats) => [...prevChats, response.data]);
        } catch (error) {
            setUserChatsError(error);
        }
    };

    // Find chat between two users
    const findChat = async (firstId, secondId) => {
        try {
            const response = await api.get(`/chat/find/${firstId}/${secondId}`);
            return response.data;
        } catch (error) {
            setUserChatsError(error);
        }
    };

   const markAllnotificationAsread = useCallback((notification) =>{
    const mNotifications = notification.map(n => {return{...n,isRead:true

    }});
    setnotification(mNotifications);

   },[])

const markNotificationonRead = useCallback((n,userChats,user,notification) =>{

    const desidchat = userChats.find((chat) =>{
        const chatmember = [user._id,n.senderId];
        const isDesiredchat = chat?.members.every((member) =>{
            return chatmember.includes(member);
        });
        return isDesiredchat
    });
    const mNotification =notification.map(el =>{
        if(n.senderId === el.senderid){
            return {...n,isRead:true}
        }else{
            return el;
        }
    })
    updataCurrentChat(desidchat);
    setnotification(mNotification);
},[updataCurrentChat]
)



const markthisnotificationAsread = useCallback((thisUserNotification, notification, setnotification) => {
    const updatedNotifications = notification.map(el => {
        const foundNotification = thisUserNotification.find(n => n.senderId === el.senderId);
        if (foundNotification) {
            return { ...el, isRead: true };
        }
        return el;
    });
    setnotification(updatedNotifications);
}, []);



    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatLoading,
                userChatsError,
                potentialChats,
                createChat,
                updataCurrentChat,
                messages,
                isMessageLoading,
                messageError,
                currentChat,
                findChat,                
                sendtextmessage,
                onlineuser,
                notification,
                allUsers,
                markAllnotificationAsread,
                markNotificationonRead,
                markthisnotificationAsread,
                setnotification,
                newmessage,
                setcurrentChat
                
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
