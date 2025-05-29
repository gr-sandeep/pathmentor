import { Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { headers, OPENAI_URL } from "../utils/Config";
import Markdown from "react-markdown";
import ai from "../assets/ai.png";
import newchat from "../assets/newchat.jpg";
import user from "../assets/user.png";
import { Button } from "antd";
import { RiMailSendFill, RiChatNewLine } from "react-icons/ri";

const DUMMY_AI_MESSAGE = { role: "assistant", content: "Pathmentor is generating the response..." };
const SYSTEM_PROMPT = "You are a helpful assistant.";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setmessages] = useState([]);
  const [userInput, setuserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Helper to remove dummy message if present
  const removeDummyMessage = (prev) => {
    const last = prev[prev.length - 1];
    return last && last.role === "assistant" && last.content === DUMMY_AI_MESSAGE.content ? prev.slice(0, -1) : prev;
  };

  const handleNewChat = () => {
    setmessages([]);
    setuserInput("");
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userMessage = { role: "user", content: userInput };
    setmessages((prev) => [...prev, userMessage, DUMMY_AI_MESSAGE]);
    setuserInput("");
    setLoading(true);
    try {
      const response = await axios.post(
        OPENAI_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...[...messages, userMessage].map((msg) => ({ role: msg.role, content: msg.content })),
            {
              role: "user",
              content: "Please respond to the user's message and advise them on how to improve their skills and career growth based on the role. for a general greeting message, use shorter response.",
            },
          ],
        },
        headers
      );
      const assistantReply = response.data.choices?.[0]?.message?.content || "No response from assistant.";
      setmessages((prev) => [
        ...removeDummyMessage(prev),
        { role: "assistant", content: assistantReply },
      ]);
    } catch (error) {
      setmessages((prev) => [
        ...removeDummyMessage(prev),
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-5 pb-2">
        <div className={`flex flex-col items-center justify-center ${messages.length === 0 ? "h-full w-full" : ""}`}>
          {messages.length > 0 ?
            messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const isAssistant = msg.role === "assistant";
              const isDummy = isAssistant && msg.content === DUMMY_AI_MESSAGE.content;
              return isUser ? (
                <div className="flex place-self-end gap-1 items-start max-w-[80%] mb-5" key={index}>
                  <div
                    className="border border-[#41C5F2] p-2 px-4 rounded-l-xl rounded-br-xl w-full break-words mb-2"
                  >
                    {msg.content}
                  </div>
                  <img src={user} alt="user" className="w-10 h-10 -mt-4" />
                </div>
              ) : (
                isAssistant && (
                  <div className="flex place-self-start gap-1 items-start mb-5 max-w-[80%]" key={index}>
                    <img src={ai} alt="ai" className="w-9 h-10 -mt-4" />
                    <div
                      className={
                        isDummy
                          ? "font-semibold animate-fade w-full break-words bg-transparent px-4 py-2"
                          : "border border-[#CBCBCB] p-2 px-4 rounded-r-xl rounded-bl-xl w-full break-words"
                      }
                    >
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                )
              );
            })
            : (
              <div className="m-auto flex justify-center">
                <img className="w-1/2 rounded-xl drop-shadow-xl" src={newchat} alt="" />
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="w-full flex gap-4 px-2 sm:px-10 md:px-32 pb-5 sticky bottom-0">
        <Button onClick={handleNewChat} title={messages.length === 0 ? "Already in a new chat" : "New Chat"} disabled={messages.length === 0} size="large" className="w-fit">
          <RiChatNewLine className="flex size-5 cursor-pointer" />
        </Button>
        <Input
          onPressEnter={handleSendMessage}
          value={userInput}
          placeholder={loading ? "Please wait..." : "Please enter your message..."}
          onChange={(e) => setuserInput(e.target.value)}
          disabled={loading}
        />
        <Button size="large" title={userInput ? "Send message" : "Please enter your message"} type={userInput ? "primary" : undefined} onClick={handleSendMessage} disabled={!userInput}><RiMailSendFill className="size-5" /></Button>
      </div>
    </div >
  );
};

export default Chat;
