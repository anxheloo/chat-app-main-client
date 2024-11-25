import React, { memo, useState } from "react";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTE } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";

const Login = memo(() => {
  const { setUserInfo,updateKeys } = useAppStore();
  const navigate = useNavigate();
  console.log("inside login form");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateSignup = () => {
    if (!formData.email.length) {
      alert("Email is required.");
      return false;
    }

    if (!formData.password.length) {
      alert("Password is required.");
      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateSignup()) return;

    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("this is reposnse :", response);

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        updateKeys({ status: "success", message: response.data?.message });
        
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    } catch (err) {
      console.log("this is err:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-[300px] flex flex-col justify-between py-4"
    >
      <div className="flex flex-col gap-2">
        <input
          id="email"
          className="w-full rounded-full h-[50px] border border-slate-400 px-3"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          id="password"
          className="w-full rounded-full h-[50px] border border-slate-400 px-3"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full h-[50px] bg-black rounded-full text-white mt-10"
      >
        Login
      </button>
    </form>
  );
});

export default Login;
