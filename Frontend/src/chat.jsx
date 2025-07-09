import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import attach from './assets/attach.png';
import send from './assets/send.png';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // Import highlight.js styles

function Chat() {
    const tempMsg = "Hello, I'm currently experiencing some issues. Please try again later.";
    const location = useLocation();
    const [typedMsg, setTypedMsg] = useState(location.state?.userMsg || "");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const storedMsgs = localStorage.getItem("messages");
        if (storedMsgs) {
            setMessages(JSON.parse(storedMsgs));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    const formatCode = (input) => {
        const trimmedInput = input.trim(); 

        if (trimmedInput.includes("function") || 
            trimmedInput.includes("def") || 
            trimmedInput.includes("{") || 
            trimmedInput.includes("=>")) {
            return `\`\`\`js\n${trimmedInput}\n\`\`\``;
        }

        return trimmedInput;
    };



    const MsgBox = ({ msg, isBot }) => (
        <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
            <p className={`text-black rounded-xl p-5 mx-8 my-3 ${isBot ? "text-left bg-purple-300" : "bg-purple-50"}`}>
                <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                >
                    {msg}
                </ReactMarkdown>
            </p>
        </div>
    );

    const handleChat = async () => {
        const formattedMsg = formatCode(typedMsg);
        if (formattedMsg === "") return;

        const newUserMessage = { text: formattedMsg, isBot: false };
        setMessages(prev => [...prev, newUserMessage]);
        setTypedMsg("");  
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: formattedMsg,
                    history: [...messages, newUserMessage]
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok: " + response.statusText);
            }

            const data = await response.json();
            setTimeout(() => {
                setMessages(prev => [...prev, { text: data, isBot: true }]);
                setLoading(false); 
            }, 500);

        } catch (error) {
            console.error("Error during chat:", error); 
            setTimeout(() => {
                setMessages(prev => [...prev, { text: tempMsg, isBot: true }]);
                setLoading(false); 
            }, 500);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleChat();
        }
    };

    const handleSendClick = () => {
        handleChat();
    };

    const handleAttachClick = () => {
        navigate('/');
    };

    return (
        <div className='bg-gradient-to-r from-purple-400 to-pink-300'>
            <NavBar />
            <div className='min-h-screen bg-gradient-to-r from-purple-400 to-pink-300'>
                <div className="flex flex-col bg-gradient-to-r from-purple-400 to-pink-300">
                    <div className="flex-1 overflow-y-auto p-5">
                        {messages.map((msg, index) => (
                            <MsgBox key={index} msg={msg.text} isBot={msg.isBot} />
                        ))}
                        {loading && <MsgBox msg="Thinking..." isBot={true} />}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex flex-row bg-gradient-to-r from-purple-400 to-pink-300 items-center justify-center w-full h-auto p-3">
                        <img
                            src={attach}
                            alt="Attach"
                            className="w-10 h-auto cursor-pointer"
                            onClick={handleAttachClick}
                        />
                        <textarea
                            id="user_msg"
                            className="bg-purple-100 text-black border-purple-950 border-2 p-3 rounded-2xl w-2/3 m-3"
                            value={typedMsg}
                            onChange={e => setTypedMsg(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Type your message..."
                            disabled={loading}
                        />

                        <img
                            src={send}
                            alt="Send"
                            className="w-10 h-auto cursor-pointer"
                            onClick={handleSendClick}
                            style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'default' : 'pointer' }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;