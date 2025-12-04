// frontend/src/components/chat/chat.jsx

import React from "react";
import "./chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";

// ✅ Helper: text ke andar jo bhi URL ho usko <a> link bana do
function renderWithLinks(text) {
  if (!text) return null;

  // simple URL pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    if (part.match(urlPattern)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function Chat(props) {
  const { data, onAction } = props;

  if (data["created_by"] === "server") {
    return (
      <div className="w-full flex items-end p-2">
        <FontAwesomeIcon className="mb-4" icon={faRobot} />
        <div>
          <div className="chat-message-server bg-yellow-100 flex items-center justify-end m-1 p-2 w-72 flex-col">
            {/* 🔽 yaha pe helper use kiya */}
            <p className="whitespace-normal break-words w-64">
              {renderWithLinks(data.message)}
            </p>
          </div>
          <div className="m-1 p-2 w-72">
            {data["related"] === null ? (
              <></>
            ) : (
              Object.values(data["related"]).map((value, index) => (
                <button
                  key={index}
                  className="direct-btn"
                  onClick={() => {
                    onAction(value["tag"], value["text"]);
                  }}
                >
                  {value["text"]}
                </button>
              ))
            )}
          </div>
        </div>
        <span className="flex-1"></span>
      </div>
    );
  } else if (data["created_by"] === "client") {
    return (
      <div className="w-full flex items-end p-2">
        <span className="flex-1"></span>
        <div className="chat-message-client bg-yellow-200 flex items-center justify-end m-1 p-2 w-72">
          {/* client message ke liye bhi same helper use kar sakte hain */}
          <p className="whitespace-normal break-words w-64">
            {renderWithLinks(data.message)}
          </p>
        </div>
        <FontAwesomeIcon className="mb-2" icon={faUser} />
      </div>
    );
  }

  return <div></div>;
}
