import React, { useState } from "react";
import Logo from "../assets/logo.svg";

function Contacts({ contacts, handleChatChanged }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  function changeCurrentChat(index, contact) {
    setCurrentSelected(index);
    handleChatChanged(contact);
  }

  return (
    <div className="w-[25%] border-r border-gray-800">
      <div className="py-4 w-[80%] mx-auto flex items-center gap-4">
        <img src={Logo} alt="" className="h-12 w-12 object-contain" />
        <p className=" text-2xl font-semibold">Chat App</p>
      </div>
      <div className="h-[84%] overflow-scroll">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className={`flex items-center bg-[#303050] transition-all duration-50 overflow-scroll ease-in-out gap-3 p-2 my-3 rounded-lg w-[80%] cursor-pointer mx-auto ${
              index === currentSelected && " bg-purple-400"
            }`}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <img
              src="https://img.icons8.com/external-others-cattaleeya-thongsriphong/64/null/external-Avatar-male-avatar-with-medical-mask-blue-others-cattaleeya-thongsriphong-10.png"
              alt="user_avatar"
              className="h-7 w-7 rounded-full"
            />
            <p>{contact.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contacts;
