import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";
import Navbar from "./Navbar";

function Home() {
  const { backendUrl, setIsLoggedin, setUserData, userData } =
    useContext(AppContent);
  return (
    <>
      <Navbar />
      <div className="flex justify-center flex-col items-center h-screen bg-[#171737]">
        <div className=" bg-gray-100 p-8 rounded-md text-center">
          <h3 className="text-3xl">
            {" "}
            Welcome {userData ? userData.name : " Developer"}
          </h3>
          <p className="text-2xl "> Your Email is {userData.email}</p>
        </div>
      </div>
    </>
  );
}

export default Home;
