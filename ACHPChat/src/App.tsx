import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client';

const socket = io('http://chat-backend:4000');
// const socket = io('localhost:4000')

function App() {

  const [text, setText] = useState("");
  const [chats, setChats] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    try{
      setText(e.target.value);
    }catch(e){
      console.error('Error parsing text:', e);
      setText('');
    }
    
  }
  // Function to handle the Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (text.trim() !== "") {
        // Emit the text to the server via socket
        socket.emit('message', text);

        // Add the message to the local state for immediate display
        // setChats([...chats, text]);

        // Clear the input field
        setText('');
        
        // Scroll to bottom after new message
        scrollToBottom();
      }
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Listen for welcome message from server
    socket.on('welcome', (data) => {
      console.log("this is from the socket => ", data);
    });

    // Optionally listen for incoming messages from the server
    socket.on('message', (msg: string) => {
      setChats((prevChats) => [...prevChats, msg]);
      scrollToBottom();
    });

    // Cleanup socket on unmount
    return () => {
      socket.off('welcome');
      socket.off('message');
    };
  }, []);


  return (
    <div className='w-full h-screen flex-col space-y-5 items-center justify-evenly bg-black text-white '>
      <div className='w-full flex h-[10%] items-center justify-center  text-xl'>
          Anonymous CHP Chat
      </div>
      {/* Scrollable chat container */}
      <div className='w-full h-[75%] text-lg'>
        <div 
          className='w-full h-full flex-col items-start justify-end space-y-5 overflow-y-auto p-3' 
          style={{ maxHeight: '100%' }} // Set max height and enable scrolling
        >
          {
            chats.map((chat, i) => (
              <div key={i} className='w-[40%] h-auto rounded-lg border-2 border-green-600 flex justify-start items-center p-3'>
                {chat}
              </div>
            ))
          }
          {/* Empty div for auto-scrolling */}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className='w-full flex h-[10%]  items-center  justify-center  text-lg'>
          <div className='h-[80%] rounded-lg w-[80%] bg-white px-5 text-black'>
          <input
            className='h-full w-full'
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}  // Listen for key press
          />
          </div>
      </div>
    </div>
  )
}

export default App
