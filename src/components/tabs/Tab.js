import React, { useState } from "react";
import Login from "../forms/Login";
import Signup from "../forms/Signup";

const Tab = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event) => {
    const { id } = event.target;
    setTab(Number(id));
  };

  return (
    <div className="p-5 w-full md:w-[80%] mx-auto">
      <div>
        <div className="w-full flex cursor-pointer">
          <div
            id={0}
            onClick={handleTabChange}
            className="flex-1 p-2 text-center"
          >
            Login
          </div>
          <div
            id={1}
            onClick={handleTabChange}
            className="flex-1 p-2 text-center"
          >
            Signup
          </div>
        </div>
        <div className="w-full">
          <div
            className={`bg-slate-500 h-[3px] w-1/2 translate-x-0 transition-transform ease-in-out duration-200 delay-75 rounded-md ${
              tab === 1 && "translate-x-[100%]"
            }`}
          />
        </div>
      </div>

      {tab === 0 ? <Login /> : <Signup />}
    </div>
  );
};

export default Tab;
