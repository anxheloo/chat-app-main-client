// ErrorBox.js
import React from "react";
import { useAppStore } from "../../store";

const Status = () => {

  const status = useAppStore(state => state.status);
  const message = useAppStore(state => state.message)
  const updateKeys = useAppStore(state => state.updateKeys)

  if (message) {
    setTimeout(() => {
      updateKeys({ status: null, message: null });
    }, 1000);
  }

  return (
    <div
      className={`z-[99999] bg-white/20 backdrop-blur-lg w-fit min-w-[200px] px-2 h-[50px] absolute right-5 bottom-5 flex justify-center items-center transition-all ease-in-out duration-500 
        ${
          message ? "translate-y-[0%] scale-100" : "translate-y-[200%] scale-0"
        }`}
    >
      {message}
    </div>
  );
};

export default Status;
