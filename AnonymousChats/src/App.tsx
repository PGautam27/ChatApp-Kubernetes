import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:7000');

type ChatMessage = {
  username: string;
  message: string;
};

function App() {
  const [text, setText] = useState('');
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      socket.emit('message', text);
      setText('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('welcome', (data) => {
      console.log('Socket says:', data);
    });

    socket.on('message', (msg: ChatMessage) => {
      setChats((prevChats) => [...prevChats, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off('welcome');
      socket.off('message');
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-[#0a0f1c] via-[#0f172a] to-[#1e293b] text-white font-mono">
      {/* Header */}
      <div className="py-4 px-6 bg-gradient-to-r from-blue-900 to-blue-700 text-cyan-300 text-center text-2xl font-bold shadow-xl uppercase tracking-widest border-b border-cyan-700">
        🧠 Anonymous Chat System
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-28 scrollbar-hide"> {/* ← added pb-28 to reserve space */}
        {chats.map((chat, i) => (
          <div
            key={i}
            className="max-w-[80%] lg:max-w-[60%] bg-[#1f2937] border border-cyan-600 rounded-xl p-4 shadow-lg hover:shadow-cyan-600/50 transition-shadow duration-300"
          >
            <div className="text-sm font-semibold text-cyan-400 mb-1">{chat.username}</div>
            <div className="text-base">{chat.message}</div>
          </div>
        ))}

        {/* The magic scroll anchor */}
        <div ref={chatEndRef} className="scroll-mb-28" /> {/* ← this gives margin at scroll bottom */}
      </div>

      {/* Input Box */}
      <div className="w-full p-4 bg-[#0f172a] border-t border-blue-800">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
          placeholder="> Type your message..."
          className="w-full p-3 bg-[#1e293b] border border-cyan-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-500"
        />
      </div>
    </div>
  );
}

export default App;
