import React, { useState } from "react";
import { apiClient } from "../../lib/api-client";
import { SIGNUP_ROUTES } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";

const Signup = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Password and confirm password should be the same.");
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
        SIGNUP_ROUTES,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }

      console.log("this is reposnse :", response);
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

        <input
          id="confirmPassword"
          className="w-full rounded-full h-[50px] border border-slate-400 px-3"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full h-[50px] bg-black rounded-full text-white"
      >
        Register
      </button>
    </form>
  );
};

export default Signup;
