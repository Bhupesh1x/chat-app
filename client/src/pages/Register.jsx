import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../redux/userSlice";
import Logo from "../assets/logo.svg";
import { postRequest } from "../utils/service";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.chatUser?.value);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const notification = () => toast("Creating Your Account...");
    const response = await postRequest(
      `auth/register`,
      JSON.stringify({
        username,
        email,
        password,
      })
    );

    if (!response) {
      return;
    }

    dispatch(addUser(response?.result));

    toast.success("User Created Successfully", {
      id: notification,
    });

    navigate("/");
  }

  return (
    <div className="bg-[#131324] h-[100vh] w-[100vw] text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-8 py-8 px-14 w-[90%] md:w-[60%]  lg:w-[30%] rounded-md  bg-[#00000076] shadow-lg"
      >
        <div className="flex items-center gap-4">
          <img src={Logo} alt="" className="h-14 w-14 object-contain" />
          <p className=" text-2xl font-semibold">Chat App</p>
        </div>
        <input
          type="text"
          placeholder="Username"
          className="input"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setPassord(e.target.value)}
        />
        <button
          type="submit"
          disabled={username.length <= 3 || !email || password.length < 8}
          className="bg-[#997af0] w-full disabled:bg-gray-500 disabled:cursor-not-allowed rounded-md px-4 py-2 hover:bg-[#af94f7] hover:transition-all hover:duration-150 hover:ease-in-out"
        >
          Create User
        </button>
        <p>
          Already a user{" "}
          <Link to="/login" className="text-[#997af0] cursor-pointer">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
