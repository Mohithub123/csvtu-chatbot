import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faMicrophone,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
import ChatApi from "../../api/chatApi";
import Chat from "../chat/chat";

export default function ChatBox(props) {
  const [chatBoxValue, setChatBoxValue] = useState("");
  const [micActive, setMicActive] = useState(false);
  const locked = useRef(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ STATIC WELCOME MESSAGE
  const [chats, setChats] = useState([
    {
      created_by: "server",
      message:
        "👋 Welcome to CSVTU UTD Bhilai Chatbot!\n" +
        "You can ask about courses, admission, results, exam time table, academic calendar, affiliated colleges, etc.",
      related: null,
    },
  ]);

  // 🎙 VOICE
  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result) => setChatBoxValue(result),
  });
  const { speak } = useSpeechSynthesis();

  // 🔁 CHAT UPDATER
  function updateChats(created_by, message, related = null) {
    setChats((prev) => [
      ...prev,
      {
        created_by,
        message,
        related,
      },
    ]);
    if (micActive && created_by === "server") speak({ text: message });
  }

  function onDataReceived(data) {
    setChatBoxValue("");

    if (data?.status === 200) {
      const related = Object.values(data.related || {});
      updateChats("server", data.message, related.length ? related : null);
    } else if (data?.status === 400) {
      updateChats("server", data.message);
    } else {
      updateChats("server", data?.message || JSON.stringify(data));
    }

    locked.current = false;
  }

  // ✅ AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // 🧱 UI
  return (
    <div
      className="chat-box-container flex flex-col"
      style={{
        height: props.isActive ? "580px" : 0,
        width: props.isActive ? "450px" : 0,
        opacity: props.isActive ? 1 : 0,
      }}
    >
      {/* 🔴 HEADER */}
      <div className="chat-box-top bg-red-800 h-11 w-full text-white flex items-center px-4">
        <div className="flex items-center gap-2">
          {/* ✅ REAL LOGO FROM PUBLIC FOLDER */}
          <img
            src="/csvtu-logo.png"
            alt="CSVTU Logo"
            className="chatbot-logo"
          />
          <h6 className="font-bold text-xs">
            CSVTU UTD Bhilai – College Enquiry Chatbot
          </h6>
        </div>

        <span className="flex-1" />

        {/* MIC */}
        <button
          className="speach-btn hover:scale-125 mx-3"
          style={{ color: micActive ? "lightgreen" : "white" }}
          onClick={() => setMicActive((p) => !p)}
        >
          <FontAwesomeIcon className="text-lg speach-btn-icon" icon={faMicrophone} />
        </button>

        {/* CLOSE */}
        <button
          className="hover:text-red-400 hover:scale-125"
          onClick={props.toggle}
        >
          <FontAwesomeIcon className="text-lg" icon={faXmark} />
        </button>
      </div>

      {/* 🟡 CHAT AREA */}
      <div className="chat-box-middle flex-1">
        {chats.map((item, index) => (
          <Chat
            key={index}
            data={item}
            onAction={(klass, text) => {
              if (locked.current) return;
              locked.current = true;
              updateChats("client", text);
              ChatApi.direct_request(klass).then(onDataReceived);
            }}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 🔵 INPUT BAR */}
      <div className="chat-box-bottom bg-red-800 h-16 w-full flex items-center p-3 gap-2">
        <input
          type="text"
          className="flex-1 text-sm"
          placeholder="Type Here..."
          value={chatBoxValue}
          onChange={(e) => setChatBoxValue(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (locked.current || !chatBoxValue.trim()) return;
              locked.current = true;
              updateChats("client", chatBoxValue);
              ChatApi.query_request(chatBoxValue).then(onDataReceived);
            }
          }}
        />

        {/* SPEECH INPUT */}
        <button
          className="s2t-mic-btn"
          style={{ color: listening ? "red" : "black" }}
          onClick={() => {
            if (!supported) {
              alert("Your browser does not support voice input.");
              return;
            }
            listening ? stop() : listen();
          }}
        >
          <FontAwesomeIcon className="s2t-mic-btn-icon" icon={faMicrophone} />
        </button>

        {/* SEND */}
        <button
          className="hover:text-red-500"
          onClick={() => {
            if (locked.current || !chatBoxValue.trim()) return;
            locked.current = true;
            updateChats("client", chatBoxValue);
            ChatApi.query_request(chatBoxValue).then(onDataReceived);
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
