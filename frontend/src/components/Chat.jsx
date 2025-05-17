import { Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { headers, OPENAI_URL } from "../utils/Config";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setmessages] = useState([]);
  const [userInput, setuserInput] = useState("");

  const handleSendMessage = async () => {
    setmessages((prev) => [...prev, { role: "user", content: userInput }]);

    const response = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Generate a roadmap for the role ${role} with ${complexity} complexity, ${phasesCount} phases and ${duration} months of duration`,
          },
        ],
      },
      headers
    );
  };

  return (
    <>
      <div className="m-5 sm:m-10 md:m-20 shadow-xl drop-shadow-xl rounded-lg p-5 sm:p-10 md:p-20 flex flex-col items-center justify-center">
        {messages?.map((msg, index) => {
          const isUser = msg.role === "user";
          const isAssistant = msg.role === "assistant";

          return isUser ? (
            <div
              key={index}
              className="flex place-self-end border border-[#41C5F2] p-2 px-4 rounded-l-xl rounded-br-xl w-fit"
            >
              {msg.content}
            </div>
          ) : (
            isAssistant && (
              <div
                className={
                  "border border-[#CBCBCB] p-2 px-4 rounded-r-xl rounded-bl-xl w-fit"
                }
              >
                {msg.content}
              </div>
            )
          );
        })}
        <Input
          className=""
          onPressEnter={handleSendMessage}
          value={userInput}
          placeholder="Please enter your message..."
          onChange={(e) => setuserInput(e.target.value)}
        />
      </div>
      <div
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-10 right-10 cursor-pointer"
      >
        <GoHome
          title="Chat with Pathmentor AI"
          className="rounded-full text-[#0f4583] font-bold size-12 hover:scale-105 p-2 border-2 border-[#0f4583] animate-pulse hover:animate-none"
        />
      </div>
    </>
  );
};

export default Chat;
