import { useState,useEffect,useContext } from "react";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";

const Chat = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const {user,room} = useContext(MyContext)

    const addMessageToList = (message) => {
      setMessageList((list) => [...list, message]);
    };
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
        addMessageToList(messageData);
        setCurrentMessage("");
      }
    };

   return (
    <div>
      <div className="h-full bg-gray-500">
      {messageList.map((message) => {
        return (
          <div key={message.time}>
            <div>
              <p>{user.name === message.author ? "You" : message.author}</p>
              <p>{message.content}</p>
              <p>{message.time}</p>
            </div>
          </div>
        );
      })}
    </div>
      <input type="text"
       placeholder="Hey..."
       value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }
        }
      />
      <button
        
          onClick={handleSendMessage}
        >
         send
        </button>
    </div>
   )
}

export default Chat