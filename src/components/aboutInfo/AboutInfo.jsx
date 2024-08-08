import { useState } from "react";
import "./aboutInfo.css";

const AboutInfo = () => {
    const [showAbout, setShowAbout] = useState(false);

    return (
        <div className="aboutInfo" style={showAbout ? {left: "0", top:"0"}:{}}>
            {showAbout && (
                <div className="content">
                    <div className="about-cont">
                        <h1>About</h1>
                        <p>Welcome to yBox – the simple, secure way to stay connected with the people who matter most. Our chat application is designed to provide you with a seamless and intuitive communication experience, whether you're chatting with friends, family, or colleagues.</p>

                        <p>
                            <strong>Instant Messaging: </strong>
                            Send and receive text messages in real-time. Our easy-to-use interface ensures that your conversations flow naturally, without distractions.
                        </p>
                        <p>
                            <strong>Multimedia Sharing: </strong>
                            Enhance your chats by sharing videos and images directly within the conversation. Whether it's a quick photo or an important video, yBox makes it effortless to stay connected in more dynamic ways.
                        </p>
                        <p>
                            <strong>Chat Management: </strong>
                            Add new chats to your chat list with just a few clicks. Expanding your network and staying in touch has never been easier.
                        </p>
                    </div>
                    <div className="dev-info">
                        <h1>Developed by</h1>
                        <h2>Mohammed Nizam</h2>
                        <p>UI/UX Designer &#x2022; Frontend Developer</p>

                        <div className="o-social">
                            <a className="o-link" href="https://www.instagram.com/nizam__._/">
                                <i className="fab fa-instagram"></i> nizam__._
                            </a>
                            <a className="o-link" href="https://wa.me/+917907932464/">
                                <i className="fab fa-whatsapp"></i> +917907932464
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <button className="abt-btn" style={showAbout ?{top: "20px", bottom: "unset"} : {top: "unset", bottom: "20px"}} onClick={() => setShowAbout((prev) => !prev)}>
                <i className="material-symbols-outlined">info</i> {showAbout ? "Close" : "About"}
            </button>
        </div>
    );
};

export default AboutInfo;
