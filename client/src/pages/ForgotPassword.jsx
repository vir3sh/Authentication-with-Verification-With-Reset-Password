import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { backendUrl, setIsLoggedin } = useContext(AppContent);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(backendUrl + "/api/auth/sendResetOtp", {
        email,
      });
      if (data.success) {
        setEmail("");
        toast.success("OTP sended");
      }
    } catch (error) {
      toast.error("error while sending otp", error);
    }
  };
  return (
    <div className="flex justify-center flex-col bg-[#171737] h-screen items-center">
      <div className="bg-[#ffffff] rounded-lg border-0 border-black w-1/4 text-center p-7">
        <form onSubmit={handleFormSubmit}>
          <h3 className="text-center text-2xl font-semibold">Enter Email</h3>
          <p className="text-center  font-normal">For Password Reset OTP</p>

          <input
            className="p-2 rounded outline-none bg-slate-300 w-full my-3"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button className="p-3 bg-[#171737]  rounded-md text-white w-full hover:bg-slate-600">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
