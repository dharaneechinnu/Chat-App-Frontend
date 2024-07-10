import { useContext } from "react"
import { ChatContext } from "../../Context/ChatContent"
import { AuthContext } from "../../Context/AuthContext"

const PotentialChat = () => {
  const{user} = useContext(AuthContext)
    const{potentialChats,createChat,onlineuser} = useContext(ChatContext);
   
  return (
   <>  
        <div className="all-users">
            {potentialChats && 
             potentialChats.map((u,index)=>{
                return(
                    <div 
                    className="single-user" 
                    key={index}
                    onClick={()=> createChat(user._id,u._id)}
                    >
                         {u.name}
                     <span className={
                      onlineuser?.some((user) => user?.userId === u?._id) ? "user-online" : ""}></span>
                    </div>
                )
             })
            }
        </div>
   
    </>
  )
}

export default PotentialChat