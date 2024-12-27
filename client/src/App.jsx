import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
// import Navbar from "./pages/Navbar";
function App() {
  return (
    <>
      <ToastContainer />
      {/* <Navbar /> */}

      <Routes>
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path="/" element={<Login />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forpassword" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
