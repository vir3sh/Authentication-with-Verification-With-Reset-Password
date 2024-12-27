import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const { backendUrl, setIsLoggedin, setUserData, userData } =
    useContext(AppContent);

  const navigate = useNavigate();

  const VerifyEmail = async () => {
    console.log("working1");
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/verifyOtp");
      console.log(data.message);
      console.log("working3");
      if (data.success) {
        navigate("/verifyemail");
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      navigate("/");
      data.success && setIsLoggedin(false);
      data.success && setUserData("");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex justify-between p-3 bg-[black] self-center">
      <div className="left text-white self-center">LOGO</div>
      <div className=" text-white p-2 rounded-md group relative cursor-default border-2 border-white border-solid hover:bg-slate-700">
        {userData ? userData.name[0].toUpperCase() : " @"}
        <div className=" hidden absolute group-hover:block bg-black p-3  rounded-md w-32 right-1 top-10 cursor-pointer">
          <ul>
            {!userData.isVerified && (
              <li
                className="hover:bg-slate-600 hover:rounded-md hover:w-full p-1 hover:p-1 cursor-pointer"
                onClick={VerifyEmail}
              >
                Verify
              </li>
            )}
            <li
              className="hover:bg-slate-600 hover:rounded-md hover:w-full p-1 hover:p-1 cursor-pointer"
              onClick={logout}
            >
              Log out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
