import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import Message from "../components/Message";
import { getRequest, host } from "../utils/service";
import { io } from "socket.io-client";

function Chat() {
  const user = useSelector((state) => state?.chatUser?.value);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const socket = useRef();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log("looking", user._id);
      socket.current = io(host);
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  function handleChatChanged(chat) {
    setCurrentChat(chat);
  }

  useEffect(() => {
    async function getUsers() {
      if (user) {
        const response = await getRequest(`auth/allusers/${user?._id}`);

        if (!response) {
          return;
        }
        setContacts(response.users);
      }
    }

    getUsers();
  }, []);

  return (
    <div className="bg-[#131324] h-[100vh] w-[100vw] text-white flex items-center justify-center">
      <div className="flex h-[85vh] w-[85vw] bg-[#00000076] px-6 py-4 rounded-lg">
        <Contacts contacts={contacts} handleChatChanged={handleChatChanged} />
        <div className="w-[75%]">
          {currentChat !== undefined ? (
            <Message
              currentChat={currentChat}
              currentUser={user}
              socket={socket}
            />
          ) : (
            <p className="text-center text-xl mt-10">
              Please Select A Chat To Start Messaging.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
