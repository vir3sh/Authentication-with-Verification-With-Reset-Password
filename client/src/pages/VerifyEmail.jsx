import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
function VerifyEmail() {
  const { backendUrl, setIsLoggedin, setUserData, userData, getUserData } =
    useContext(AppContent);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleForm = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/VerifyAccount",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/home");
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("invalid OTP");
    }
  };

  return (
    <div className="flex justify-center flex-col items-center h-screen bg-[#171737]">
      <div className="bg-gray-100 p-8 rounded-md text-center">
        <h3 className="text-3xl">Enter OTP</h3>
        <p className="text-2xl">Enter OTP for verification</p>
        <form onSubmit={handleForm}>
          <input
            className="p-3 outline-none rounded-lg bg-slate-400 w-full text-center text-3xl tracking-[1rem] font-mono"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            placeholder="------"
          />
          <button className="p-1 bg-[#171737] rounded-md text-white w-full hover:bg-slate-600 my-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
