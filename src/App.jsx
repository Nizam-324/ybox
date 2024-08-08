import Chat from "./components/chat/Chat";
import List from "./components/list/List";
// import Details from "./components/details/Details";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import AboutInfo from "./components/aboutInfo/AboutInfo";

// import { ToastContainer } from "react-toastify"
// import 'react-toastify/ReactToastify.css'

const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId } = useChatStore();


    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);
 
 
    if (isLoading) return <div className="loading"><span className=" material-symbols-outlined">progress_activity</span></div>;

    const isTabMob = window.innerWidth <= 834

    return (
        <div className="container" style={isTabMob ? {height: "100dvh"}:{}}>
            {currentUser ? (
                <>
                    {isTabMob && !chatId && <List />}
                    {!isTabMob && <List/>}
                    {chatId && <Chat />}
                    {/* {chatId && <Details />} */}
                
                </>
            ) : (
                <>
                    <Login />
                    <AboutInfo/>
                </>
            )}

            <Notification />

            {/* <ToastContainer position="bottom-right"/> */}
        </div>
    );
};

export default App;
