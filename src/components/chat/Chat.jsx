import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

import Details from "../../components/details/Details";


const Chat = () => {
    const [chat, setChat] = useState();
    const [openEmoji, setOpenEmoji] = useState(false);
    const [msgText, setMsgText] = useState("");
    const [file, setFile] = useState({
        file: null,
        url: "",
    });

    const [showDetails, setShowDetails] = useState(false);

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeChat } = useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (response) => {
            setChat(response.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleEmoji = (e) => {
        setMsgText((prev) => prev + e.emoji);
        setOpenEmoji(false);
    };

    const handleFile = (e) => {
        if (e.target.files[0]) {
            setFile({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSend = async () => {
        try {
            let fileUrl = null;

            if (file.file) {
                fileUrl = await upload(file.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    [file.file.type.startsWith("image/") ? "img" : "video"]: fileUrl,
                    createdAt: new Date(),
                }),
            });

            // Update user chats
            await updateUserChats(fileUrl);

            // console.log("file Url", fileUrl)

            // Clear file state
            setFile({
                file: null,
                url: "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendText = async () => {
        try {
            if (msgText === "") return;

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    msgText: msgText,
                    createdAt: new Date(),
                }),
            });

            // Update user chats
            await updateUserChats(msgText);

            // Clear message input
            setMsgText("");
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserChats = async (lastMessage) => {
        try {
            const userIDs = [currentUser.id, user.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = lastMessage;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // const formatTime = (date) => {
    //     const options = {
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true
    //     };
    //     return date.toLocaleString('en-IN', options);
    // };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); 
        const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return date.toLocaleString("en-US", options);
    };

    const handleBackClick = () => {
        changeChat(null, null);
    };

    const [showIconTabMob, setShowIconTabMob] = useState(false)

    return (
        // <>{hideChat && (
        <div className="chat">
            <div className={showDetails ? "top details-show" : "top"}>

            {/* <i className="material-symbols-outlined" onClick={handleBackClick} >arrow_back</i> */}

                {!showDetails && (
                <div className="user">
                    <i className="material-symbols-outlined" onClick={handleBackClick} >arrow_back</i>

                    <img src={user?.profAvatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.about}</p>
                    </div>
                </div> 
            )}

                {/* {!showDetails &&(
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                </div>)}
                */}

                <i className="material-symbols-outlined" onClick={() => setShowDetails((prev) => !prev)} >{showDetails ? 'arrow_back' : 'info'}</i>
                
                {showDetails && <Details/>}
            </div>
            {!showDetails && ( <>
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div className={message.senderId === currentUser.id ? "message sender" : "message"} key={message?.createdAt}>
                        <div className="texts">
                            {message.img && (
                                <>
                                    <img src={message.img} alt="" />
                                    {/* <i className="material-symbols-outlined" onClick={() => handleDownload(message.img)}>download</i> */}
                                </>
                            )}
                            {message.video && (
                                <video controls>
                                    <source src={message.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            { message.msgText && message.msgText.includes("https://") ? (
                                <a href={message.msgText} target="_blank" rel="noopener noreferrer">
                                    {message.msgText}
                                </a>
                            ) : (
                                <p>{message.msgText}
                                    <span>{formatTime(message.createdAt)}</span> 
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {file.url && (
                    <div className="message sender">
                        <div className="texts">
                            {file.file.type.startsWith("image/") ? (
                                <img src={file.url} alt="" />
                            ) : (
                                <video controls>
                                    <source src={file.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                )}
                <div id="bottom" ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icon-show-btn-tabmob">
                    <i className="material-symbols-outlined icon-show-btn"
                        onClick={() => setShowIconTabMob((prev) => !prev)}
                    >ios_share</i>
                </div>
                <div className={showIconTabMob ? " icons showIcons" : "icons"}>
                    <label htmlFor="file">
                        <i className="material-symbols-outlined">photo_library</i>
                    </label>
                    <input type="file" id="file" hidden onChange={handleFile} accept="image/*,video/*" />

                    <i className="material-symbols-outlined">photo_camera</i>
                    <i className="material-symbols-outlined">mic</i>
                </div>
                <textarea
                    type="text"
                    placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send message" : "Message"}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />

                <div className="emoji" style={{display: "none"}}>
                    <i className="material-symbols-outlined" onClick={() => setOpenEmoji((prev) => !prev)}>
                        sentiment_satisfied
                    </i>
                    <div className="picker">
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton material-symbols-outlined" onClick={file.file ? handleSend : msgText ? handleSendText : undefined} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                send
                </button>
            </div>
            </>
        )}
        </div>
        // )}</>
    );
};

export default Chat;
