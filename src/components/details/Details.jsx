import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./details.css";
import { useEffect, useState } from "react";

const Details = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();
    const [chat, setChat] = useState();

    const [showSharedPhotos, setShowSharedPhotos] = useState(false);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (response) => {
            setChat(response.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="detail">
            <div className="userD">
                <img src={user?.profAvatar || "./avatar.png"} alt="" />
                <span>
                    <h2>{user?.username}</h2>
                    <p> {user?.about} </p>
                </span>
                
            </div>
            <div className="info">
                {/* <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div> */}
                
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <i className="add material-symbols-outlined" onClick={() => setShowSharedPhotos((prev) => !prev)}>
                    {showSharedPhotos ? "expand_less" : "expand_more"}</i>

                    </div>
                    {showSharedPhotos && (<div className="photos" >
                        {chat?.messages?.map((message) => (
                            <>
                                {message.img || message.video ? (
                                    <div className="photoItem" key={message?.createdAt}>
                                        <div className="photoDetail">
                                            <img src={message.img || message.video} alt="" />
                                            <span>roshmon.png</span>
                                        </div>
                                        <i className="material-symbols-outlined">download</i>
                                    </div>
                                ) : null}
                            </>
                        ))}
                    </div>)}
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <i className="add material-symbols-outlined" onClick={() => setShowSharedPhotos((prev) => !prev)}>
                    {showSharedPhotos ? "expand_less" : "expand_more"} </i>
                    </div>
                </div>
                <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
                {/* <button className='logout' onClick={() => auth.signOut()} >Logout</button> */}
            </div>
        </div>
    );
};

export default Details;
