import { useState, useEffect } from "react";
import NavBar from "./navbar";
import newImg from "./assets/new.png";
import { Link, useNavigate } from "react-router-dom";

function VirtualAssistant() {
    const welcomeMsg = " Hi! I am your virtual assistant. How can I help you today?";
    const [chatId, setChatId] = useState(0);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    const [allChats, setAllChats] = useState({});

    const [displayChat, setDisplayChat] = useState("");

    const handleHistory = (id) => {
        const existingMessages = allChats[id] || [];
        navigate('/chat', { state: { id, messages: existingMessages } });
    };

    useEffect(() => {
        setDisplayChat(""); // Reset before typing
        let index = 0;
        const interval = setInterval(() => {
            setDisplayChat((prevText) => prevText + welcomeMsg[index]);
            index++;
            if (index >= welcomeMsg.length-1) {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [welcomeMsg]);

    useEffect(() => {
        const storedChats = JSON.parse(localStorage.getItem("allChats")) || {};
        setAllChats(storedChats);
    }, []);

    useEffect(() => {
        localStorage.setItem("allChats", JSON.stringify(allChats));
    }, [allChats]);

    useEffect(() => {
        const handlePopState = () => {
            const storedChats = JSON.parse(localStorage.getItem("allChats")) || {};
            setAllChats(storedChats);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        setHistory(storedHistory);
        if (storedHistory.length > 0) {
            setChatId(Math.max(...storedHistory));
        }
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(history));
        }
    }, [history]);

    const handleChat = () => {
        const newId = chatId + 1;
        setChatId(newId);
        const updatedHistory = [...history, newId];
        setHistory(updatedHistory);
        handleHistory(newId);
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory)); 
        navigate('/chat', { state: { id: newId } });
    };

    return (
        <div>
            <NavBar />
            <div className="flex flex-row h-screen bg-gradient-to-r from-purple-400 to-pink-200">
                <div className="w-64 bg-white/70 h-full shadow-lg flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Old Chats</h2>
                        <img src={newImg} alt="New Chat" className="w-8 h-8 cursor-pointer" onClick={handleChat} />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {history.length === 0 && (
                            <div className="m-3 text-gray-600">No chats yet.</div>
                        )}
                        {history.map((id) => (
                            <Link
                                to='/chat'
                                state={{ id }}
                                key={id}
                                className="block"
                            >
                                <div className="flex items-center bg-purple-300 p-3 m-3 rounded-lg cursor-pointer hover:bg-purple-400 transition duration-300">
                                    <h1 className="text-purple-950 text-xl font-bold">Chat {id}</h1>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                </div>
                <h1 className="text-purple-950 text-5xl text-center font-bold lg:mx-10 lg:my-48">{displayChat}</h1>
                    
            </div>
        </div>
    );
}

export default VirtualAssistant;
