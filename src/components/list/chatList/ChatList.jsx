import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/Adduser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (response) => {
            const items = response.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return { ...item, user };
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try { 
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(searchInput.toLowerCase()));

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <i className="material-symbols-outlined">search</i>
                    <input type="text" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} />
                </div>
                <i alt="" className="add material-symbols-outlined" onClick={() => setAddMode((prev) => !prev)}>
                    {addMode ? "close" : "add"}
                </i>
            </div>

            {filteredChats.map((chat) => (
                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}>
                    <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.profAvatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                        <p> {chat.lastMessage.includes("firebasestorage.googleapis.com") ? "Media file" : chat.lastMessage} </p>
                    </div>
                    <div
                        className="msgIndicator"
                        style={{
                            backgroundColor: chat?.isSeen ? "transparent" : "#ffffffba",
                        }}
                    ></div>
                </div>
            ))}

            {addMode && <AddUser />}
        </div>
    );
};

export default ChatList;
