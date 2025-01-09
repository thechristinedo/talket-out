import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatBoxSkeleton from "./skeletons/ChatBoxSkeleton";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

import { formatDateStamp, formatTimeStamp, isSameDay } from "../lib/utils";

const ChatBox = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    updateMessages,
    retireFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);

    updateMessages();

    return () => retireFromMessages();
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="w-full flex flex-col">
        <ChatHeader />
        <ChatBoxSkeleton />
        <ChatInput />
      </div>
    );

  return (
    <div className="w-full flex flex-col">
      <ChatHeader />
      <div className="w-full overflow-y-auto px-3 mt-auto">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`py-4 flex items-start gap-3 ${
              message.senderId === selectedUser?._id ? "" : "flex-row-reverse"
            }`}
            ref={messageEndRef}
          >
            <img
              src={
                message.senderId === selectedUser?._id
                  ? selectedUser?.profilePic || "img/avatar.jpg"
                  : authUser?.profilePic || "img/avatar.jpg"
              }
              alt="User icon"
              className="size-12 rounded-full mt-auto"
            />
            <div
              className={`flex flex-col w-full ${
                message.senderId === selectedUser?._id
                  ? "items-start"
                  : "items-end"
              }`}
            >
              <div className="text-xs mb-1 text-gray-500 flex gap-2">
                {!isSameDay(new Date(message.createdAt), new Date()) && (
                  <span>{formatDateStamp(new Date(message.createdAt))}</span>
                )}

                <span>{formatTimeStamp(new Date(message.createdAt))}</span>
              </div>
              <div
                className={` rounded-2xl px-3 py-2 ${
                  message.senderId === selectedUser?._id
                    ? "rounded-bl-none bg-gray-200"
                    : "rounded-br-none bg-blue-200"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Message attachment"
                    className="size-24 rounded-md"
                  />
                )}
                {message.text && (
                  <p className="text-md break-all md:break-words">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatBox;
