import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children})=>{
    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({})

    const auth = useContext(AuthContext); // safer access
    const socket = auth?.socket;
    const axios = auth?.axios;

    // const {socket, axios} = useContext(AuthContext);

    // functions to get all the users to sidebar
    const getUsers = async()=>{
        try {
            const {data} = await axios.get("/api/messages/users")
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected users
    const getMessages = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessage(data.messages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to send message to selected user
    const sendMessage = async(messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if(data.success){
                setMessage((prevMessages)=>[...prevMessages, data.newMessage])
            }
            else{
                toast.error(error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected users

    const subscribeToMessages = async ()=>{
        if(!socket) return;
        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessage((prevMessages)=> [...prevMessages, newMessage])
                axios.put(`/api/message/mark/${newMessage._id}`)
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId]:prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessage = async()=>{
        if(socket) socket.off("newMessage");

    }
    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessage();
    },[socket,selectedUser])

    useEffect(() => {
        if (!auth?.authUser) {
            setSelectedUser(null);       // ✅ Reset selected user
            setMessage([]);              // ✅ Clear previous messages
            setUnseenMessages({});       // ✅ Optional: clear unseen badges
        }
    }, [auth?.authUser]);


    const value = {
        message, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }
    return (
    <ChatContext.Provider value={value}> 
            {children}
    </ChatContext.Provider>
    )
    
}