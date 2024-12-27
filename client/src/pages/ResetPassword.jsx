import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
function ResetPassword() {
  const { backendUrl, setIsLoggedin, setUserData, userData, getUserData } =
    useContext(AppContent);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handlePassword = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/resetPassword",
        { email, password, otp }
      );
      if (data.success) {
        toast.success("Password Reset Successfull");
        navigate("/");
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("invalid otp");
    }
  };
  return (
    <div className="flex justify-center flex-col items-center h-screen bg-[#171737]">
      <div className="bg-gray-100 p-8 rounded-md text-center">
        <h3 className="text-3xl">EnterRESET PASSWORD OTP</h3>
        <p className="text-2xl">Enter OTP for setting password</p>
        <form onSubmit={handlePassword}>
          <input
            className="p-2 rounded outline-none bg-slate-300 w-full my-2"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
          <input
            className="p-2 rounded outline-none bg-slate-300 w-full my-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New Password"
          />
          <input
            className="p-3 outline-none rounded-lg bg-slate-400 w-full text-center text-3xl tracking-[1rem] font-mono"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            placeholder="Enter OTP"
          />
          <button className="p-1 bg-[#171737] rounded-md text-white w-full hover:bg-slate-600 my-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
