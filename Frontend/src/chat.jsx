import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import NavBar from './navbar';
import attach from './assets/attach.png';
import send from './assets/send.png';

function Chat() {
    const location = useLocation();
    const initialMessages = location.state?.messages || [];
    const chatId = location.state?.id || 0;
    const storageKey = `chat-${chatId}`;
    const navigate = useNavigate();

    const [typedMsg, setTypedMsg] = useState(location.state?.userMsg || "");
    const [messages, setMessages] = useState(initialMessages);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const isDSAGuide = localStorage.getItem("isDSAGuide");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
        setMessages(stored);
    }, [chatId]);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages, storageKey]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const MsgBox = ({ msg, isBot }) => (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
            <p className={`text-black rounded-xl p-5 mx-8 my-3 ${isBot ? 'bg-purple-300' : 'bg-purple-50'}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {msg}
                </ReactMarkdown>
            </p>
        </div>
    );

    const handleChat = async () => {
        const trimmedMsg = typedMsg.trim();
        if (trimmedMsg === "") return;

        const userMessage = { text: trimmedMsg, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setTypedMsg("");
        setLoading(true);

        let response;

        try {
            if (isDSAGuide) {
                response = await fetch('http://localhost:8000/guide/dsa_guide', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ problem: trimmedMsg, history: [...messages, userMessage] })
                });

            }
            else{
                response = await fetch('http://localhost:8000/chat/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: trimmedMsg,
                        history: [...messages, userMessage]
                    })
                });
            }

            

            const data = await response.json();

            setTimeout(() => {
                setMessages(prev => [...prev, { text: data, isBot: true }]);
                setLoading(false);
            }, 500);
        } catch (err) {
            setMessages(prev => [...prev, { text: `Oops, something went wrong.${err}`, isBot: true }])
            setLoading(false);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    };

    return (
        <div className='bg-gradient-to-r from-black to-blue-950'>
            <NavBar />
            <div className='min-h-screen'>
                <div className='flex flex-col'>
                    <div className='flex-1 overflow-y-auto m-5 p-5'>
                        {messages.map((msg, i) => (
                            <MsgBox key={i} msg={msg.text} isBot={msg.isBot} />
                        ))}
                        {loading && <MsgBox msg="Thinking..." isBot />}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='flex flex-row items-center justify-center p-3'>
                        <img src={attach} className="w-10 cursor-pointer" onClick={() => navigate('/')} />
                        <textarea
                            className="bg-purple-100 border-2 border-purple-950 p-3 rounded-2xl w-2/3 m-3"
                            value={typedMsg}
                            onChange={e => setTypedMsg(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <img
                            src={send}
                            className="w-10 cursor-pointer"
                            onClick={handleChat}
                            style={{ opacity: loading ? 0.5 : 1 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
