import React from "react";
import Tab from "../../components/tabs/Tab";

const Auth = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vh] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl">
        <div className="flex flex-col gap-10 items-center h-full">
          <div className="flex flex-col h-full max-h-[200px] justify-center">
            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
            <p className=" font-medium text-center">
              Fill in the details to get started with arbri chat app!
            </p>
          </div>

          <Tab />
        </div>
      </div>
    </div>
  );
};

export default Auth;
