import { useState,useEffect,useContext } from "react";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";

const Chat = () => {
    const [currentMessage, setCurrentMessage] = useState("");
 
    const {user,room,messageList} = useContext(MyContext)

  
    const handleSendMessage =  () => {
      console.log(currentMessage,"currentMessage")
      console.log(room,"room")
      console.log(user.name,"user.name")
      if (currentMessage) {
        const messageData = {
          room: room,
          author: user.name,
          content: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
       socket.emit("send_message", messageData);
        // addMessageToList(messageData);
        setCurrentMessage("");
      }
    };
  

   return (
    <div className="flex flex-col justify-between w-2/4 mx-auto">
      <div className="h-full rounded-md bg-gray-500 p-4">
      {messageList.map((message) => {
        return (
          <div key={message.time} className={`flex ${user.name === message.author ? "justify-start" : "justify-end"} mb-4`}>
            <div className={` rounded-lg px-4 py-2 ${user.name === message.author ? "mr-4 bg-blue-300" : "ml-4 bg-white"} text-sm`}>
              <p className="font-medium">{user.name === message.author ? "You" : message.author}</p>
              <p>{message.content}</p>
              <p className="text-gray-500 text-xs">{message.time}</p>
            </div>
          </div>
        );
      })}
    </div>
    <div className="flex items-center justify-between bg-gray-500 p-4">
      <input type="text"
       className="border border-gray-400 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
       placeholder="Hey..."
       value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }
        }
      />
      <button
         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg ml-4 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          onClick={handleSendMessage}
        >
             &#9658;
        </button>
        </div>
    </div>
   )
}

export default Chat