import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import { data, useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/register", {
        name,
        email,
        password,
      });

      // Debugging the response before using it
      // console.log("Response from server:", data);

      if (data.success) {
        setName("");
        setEmail("");
        setPassword("");
        setIsLoggedin(true);
        getUserData();
        navigate("/home");
        toast.success("User registered successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });
      if (data.success) {
        setEmail("");
        setPassword("");
        setIsLoggedin(true);
        getUserData();
        navigate("/home");
        toast.success("Login successfully");
      } else {
        toast.error("error while login ");
      }
    } catch (error) {
      toast.error("error while login", error);
    }
  };

  return (
    <div className="flex justify-center flex-col bg-[#171737] h-screen items-center">
      <div className="bg-[#ffffff] rounded-lg border-0 border-black w-1/4 text-center p-7">
        <form onSubmit={state === "Sign Up" ? handleFormSubmit : handleLogin}>
          <h3 className="text-center text-2xl font-semibold">
            {state === "Sign Up" ? "Sign Up" : "Log In"}
          </h3>

          {state === "Sign Up" && (
            <input
              className="p-2 rounded outline-none bg-slate-300 w-full my-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
          )}

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
            placeholder="Enter Password"
          />

          <p className="my-4">
            {state === "Sign Up" ? "Already a User?" : "New here?"}{" "}
            <p
              className="text-blue-500 hover:underline"
              onClick={() =>
                setState(state === "Sign Up" ? "Log In" : "Sign Up")
              }
            >
              {state === "Sign Up" ? "Log In" : "Sign Up"}
            </p>
          </p>

          <button className="p-3 bg-[#171737]  rounded-md text-white w-full hover:bg-slate-600">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
