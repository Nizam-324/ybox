import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
    const [profAvatar, setProfAvatar] = useState({
        file: null,
        url: "",
    });

    const [loading, setLoading] = useState(false);

    const [toggle, setToggle] = useState(1)
    function updateToggle(id) {
        setToggle(id)
    }

    const handleProfAvatar = (e) => {
        if (e.target.files[0]) {
            setProfAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { username, about, email, password } = Object.fromEntries(formData);

        // VALIDATE UNIQUE USERNME
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", username));
        const querySnapShot = await getDocs(q);
        if (!querySnapShot.empty) {
            return toast.warn("Username is already taken!");
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            // const imgUrl = await upload(profAvatar.file);
            let imgUrl = "./avatar.png"; // Default avatar URL
            if (profAvatar.file) {
                imgUrl = await upload(profAvatar.file);
            }

            await setDoc(doc(db, "users", response.user.uid), {
                username,
                about,
                email,
                profAvatar: imgUrl,
                id: response.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", response.user.uid), {
                chats: [],
            });

            toast.success("Your account has been created successfully! You can login now.");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">

            <div className="background">
                    <img src="./logo.png" alt="" />
                    {/* <h1><span>Y</span>B<span>ox</span></h1> */}
                    <h1><span>Y</span>Box</h1>
                
            </div>

            <div className="login-signup">

            <div className="authTabs">
                <div className="tabs">
                    <div className={toggle === 1 ? "loginTab active" : "loginTab"} onClick={() => updateToggle(1)} >Login</div>
                    <div className={toggle === 2 ? "signupTab active" : "signupTab"} onClick={() => updateToggle(2)} >Sigup</div>
                </div>
            </div>


            <div className={toggle === 1 ? "item show": "item"} >
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            
            <div className={toggle === 2 ? "item show": "item"} >
                <h2>Create an account</h2>
                <form onSubmit={handleRegister} className="signup">
                    <span className="left">
                        <label htmlFor="file">
                            <img src={profAvatar.url || "./avatar.png"} alt="" />
                            <i className="material-symbols-outlined">add_photo_alternate</i>
                        </label>
                        <input type="file" id="file" hidden onChange={handleProfAvatar} />

                        <input type="text" placeholder="Username" name="username" onChange={(event) => event.target.value = event.target.value.toLowerCase()} required />
                    </span>
                    
                    <span className="right">
                        <input type="text" placeholder="About" name="about" required />
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="password" name="password" placeholder="Password" required />

                        <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                    </span>
                </form>
            </div>
            </div>
        </div>
    );
};

export default Login;
