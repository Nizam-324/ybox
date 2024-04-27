import { useState } from 'react';
import { auth, db } from '../../../lib/firebase';
import { useUserStore } from '../../../lib/userStore';
import './userInfo.css';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import upload from '../../../lib/upload';

const Userinfo = () => {
    const { currentUser } = useUserStore();

    const [profAvatar, setProfAvatar] = useState({
        file: null,
        url: currentUser.profAvatar || "./avatar.png",
    });

    const [loading, setLoading] = useState(false);

    const [userUpdate, setUserUpdate] = useState(false)

    const handleProfAvatar = (e) => {
        if (e.target.files[0]) {
            setProfAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { username, about } = Object.fromEntries(formData);

        // Validate unique username
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", username));
        const querySnapShot = await getDocs(q);
        if (!querySnapShot.empty && username !== currentUser.username) {
            toast.warn("Username is already taken!");
            setLoading(false);
            return;
        }

        try {

            let imgUrl = currentUser.profAvatar || "./avatar.png"; // Default avatar URL
            if (profAvatar.file) {
                imgUrl = await upload(profAvatar.file);
            }

            const userRef = doc(db, "users", currentUser.id);
            await updateDoc(userRef, {
                username,
                about,
                profAvatar: imgUrl,
            });

            toast.success("Your account has been updated successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="userInfo">
            <div className="current-user">
            <div className="user">
                <img src={currentUser.profAvatar || "./avatar.png"} alt="" />
                <span>
                    <h2>{currentUser.username}</h2>
                    <p>{currentUser.about}</p>
                </span>
            </div>
            <div className="icons">
                <i className="material-symbols-outlined" onClick={() => setUserUpdate((prev) => !prev)}>{userUpdate ? "edit_off" : "edit_square"}</i>
                <i className="material-symbols-outlined" onClick={() => auth.signOut()}>logout</i>
            </div>
            </div>
            
            {userUpdate && <div className="item" >
                <h2>Update account</h2>
                <form onSubmit={handleUpdate}>
                    <label htmlFor="file">
                        <img src={profAvatar.url} alt="" />
                        <i className="material-symbols-outlined">add_photo_alternate</i>
                    </label>
                    <input type="file" id="file" hidden onChange={handleProfAvatar} />

                    <input type="text" placeholder="Username" name="username" defaultValue={currentUser.username} />
                    <input type="text" placeholder="About" name="about" defaultValue={currentUser.about} />

                    <button disabled={loading}>{loading ? "Loading" : "Update"}</button>
                </form>
            </div>}
        </div>
    );
};

export default Userinfo;