import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { colors, getColor } from "../../utils/constants";
import { apiClient } from "../../lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  GET_PROFILE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
} from "../../lib/utils";

const Profile = () => {
  const { userInfo, setUserInfo, updateKeys, status, message } = useAppStore();
  const navigate = useNavigate();

  console.log("this is message, this is status:", status, message);

  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName ?? "",
    lastName: userInfo?.lastName ?? "",
    selectedColor: userInfo?.selectedColor ?? 0,
  });
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  const validateProfile = () => {
    if (!formData.firstName.length) {
      alert("First name is required.");
      return false;
    }

    if (!formData.lastName.length) {
      alert("Last name is required.");
      return false;
    }

    return true;
  };

  const saveChanges = async (event) => {
    event.preventDefault();

    if (!validateProfile()) return;

    try {
      const res = await apiClient.post(
        GET_PROFILE_ROUTE,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          color: formData.selectedColor,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setUserInfo(res.data);
        updateKeys({ status: res.status, message: "Profile updated!" });

        navigate("/chat");
      }
    } catch (error) {}
  };

  const handleChange = (event, index) => {
    const { id, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [id]: index !== undefined ? index : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });

        if (res.status === 200 && res.data.image) {
          updateKeys({ status: res.status, message: res.data.message });
          setUserInfo({
            ...userInfo,
            image: res.data.image,
          });
        }
      } catch (err) {
        console.log("this is error:", err);
        alert("something went wrong");
      }

      // const reader = new FileReader();
      // reader.onload = () => {
      //   setFormData((prev) => ({ ...prev, image: reader.result }));
      // };

      // reader.readAsDataURL(file);
    }
  };

  const removeImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (res.status === 200) {
        updateKeys({ status: res.status, message: res.data.message });
        setUserInfo({ ...userInfo, image: null });
      }
    } catch (error) {
      alert(error.message);
      console.log("this is error:", error);
    }
  };

  const handleBackBtn = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      updateKeys({ status: 404, message: "Please setup profile" });
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <form
      onSubmit={saveChanges}
      className="bg-primary h-[100vh] flex items-center justify-between flex-col py-5"
    >
      <div className="flex flex-col w-full max-w-[500px] px-5">
        <div onClick={handleBackBtn}>
          <IoArrowBackCircleSharp className="text-white cursor-pointer text-4xl" />
        </div>

        <div className="flex flex-col md:flex-row gap-5 h-full mt-10">
          <div
            className="relative size-fit mx-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="size-28 rounded-full overflow-hidden">
              {userInfo.image ? (
                <img
                  src={`${HOST}/${userInfo.image}`}
                  alt="avatar"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div
                  className={` uppercase w-full h-full text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    formData.selectedColor
                  )}`}
                >
                  {formData.firstName
                    ? formData.firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </div>

            {hovered && (
              <div
                // onClick={formData.image ? removeImage : handleFileInputClick}
                onClick={userInfo.image ? removeImage : handleFileInputClick}
                className=" absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer rounded-full text-white text-3xl"
              >
                {userInfo.image ? <CiTrash className="" /> : <CiCirclePlus />}
              </div>
            )}
            <input
              id="image"
              name="profile-image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className=" hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex w-full flex-col gap-3 text-white items-center">
            <input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
            />

            <input
              placeholder="First name"
              type="text"
              value={formData.firstName}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
              onChange={handleChange}
              id="firstName"
            />

            <input
              placeholder="Last name"
              type="text"
              value={formData.lastName}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
              onChange={handleChange}
              id="lastName"
            />

            <div className="w-full flex justify-center py-3 gap-5">
              {colors.map((color, index) => (
                <div
                  id="selectedColor"
                  onClick={(event) => handleChange(event, index)}
                  key={index}
                  className={`size-8 transition-all duration-300 rounded-full cursor-pointer hover:opacity-80 ${color} ${
                    formData.selectedColor === index
                      ? "outline outline-white outline-1"
                      : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        onClick={saveChanges}
        className="w-full max-w-[400px] mx-auto p-3 bg-black text-white rounded-md hover:opacity-75 z-10"
      >
        Save Changes
      </button>
    </form>
  );
};

export default Profile;
