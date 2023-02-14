import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../redux/userSlice";
import { postRequest } from "../utils/service";
import { v4 as uuidv4 } from "uuid";

function Message({ currentChat, currentUser, socket }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [arivalMessage, setArivalMessage] = useState(null);
  const scrollRef = useRef();

  function logOut() {
    dispatch(addUser(null));
    navigate("/login");
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    const response = await postRequest(
      `message/addmsg`,
      JSON.stringify({
        from: currentUser?._id,
        to: currentChat?._id,
        message,
      })
    );

    socket.current.emit("send-msg", {
      from: currentUser?._id,
      to: currentChat?._id,
      message,
    });

    if (!response) {
      return;
    }

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: message });
    setMessages(msgs);

    console.log("res", response);
    setMessage("");
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arivalMessage && setMessages((prev) => [...prev, arivalMessage]);
  }, [arivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function getUsers() {
      const response = await postRequest(
        `message/getmsg`,
        JSON.stringify({
          from: currentUser?._id,
          to: currentChat?._id,
        })
      );

      if (!response) {
        return;
      }

      setMessages(response);
    }

    getUsers();
  }, [currentChat, currentUser?._id]);

  return (
    <div className="py-4  relative h-[100%] pl-4">
      {/* Header  */}
      <div className="bg-[#303050] h-12 flex items-center justify-between px-3  rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src="https://img.icons8.com/external-others-cattaleeya-thongsriphong/64/null/external-Avatar-male-avatar-with-medical-mask-blue-others-cattaleeya-thongsriphong-10.png"
            alt="user_avatar"
            className="h-7 w-7 rounded-full"
          />
          <p className="text-lg font-semibold">{currentChat.username}</p>
        </div>

        <img
          src="https://img.icons8.com/ios-glyphs/30/FFFFFF/logout-rounded--v1.png"
          alt=""
          className="h-6 w-6 object-contain cursor-pointer"
          onClick={logOut}
        />
      </div>

      {/* Message */}
      <div className="my-3 h-[75%] overflow-scroll">
        {messages?.map((msg, i) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              key={i}
              className={`p-3 w-fit my-3 flex rounded-md ${
                msg.fromSelf === true
                  ? " bg-blue-400 ml-auto"
                  : " bg-orange-400 mr-auto"
              }`}
            >
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-[#303050] absolute bottom-0 w-full px-3 rounded-lg">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center justify-between h-12 gap-3"
        >
          <img
            src="https://img.icons8.com/material-outlined/24/FFFFFF/happy--v1.png"
            alt=""
            className="h-6 w-6 object-contain cursor-pointer"
          />
          <input
            value={message}
            type="text"
            placeholder="Enter your message here"
            className="flex-1 p-0.5 bg-transparent outline-none"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">
            <img
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/filled-sent.png"
              alt=""
              className="h-6 w-6 object-contain cursor-pointer"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Message;
