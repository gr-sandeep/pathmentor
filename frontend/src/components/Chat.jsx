import React from "react";
import chatBot from "../assets/chatbot.png";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed bottom-10 right-10 cursor-pointer">
        <img
          title="Chat with Pathmentor AI"
          className="rounded-full size-14 hover:scale-105 p-2 border-2 border-gray-400 animate-bounce"
          src={chatBot}
          alt=""
        />
      </div>
    </>
  );
};

export default Chat;
