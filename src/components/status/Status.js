// ErrorBox.js
import React from "react";
import { useAppStore } from "../../store";

const Status = () => {
  const { status, message, updateKeys } = useAppStore();

  if (message) {
    setTimeout(() => {
      updateKeys({ status: null, message: null });
    }, 4000);
  }

  return (
    <div
      className={`z-[99999] bg-white w-fit min-w-[200px] px-2 h-[50px] absolute right-5 bottom-5 flex justify-center items-center transition-all ease-in-out duration-500 
        ${
          message ? "translate-y-[0%] scale-100" : "translate-y-[200%] scale-0"
        }`}
    >
      {message}
    </div>
  );
};

export default Status;
