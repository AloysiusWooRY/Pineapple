import React from "react";
import Logo from "../assets/logo-no-background.png";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import PasswordStrengthBar from 'react-password-strength-bar';

export default function Login() {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div
      id="login"
      className="flex items-center justify-between min-h-screen bg-[#161618]"
    >
      <section className="flex flex-col items-center justify-center w-full p-5">
        <div className="flex flex-col items-center justify-center text-center">
          <img src={Logo} alt="logo" className="h-44" />
        </div>
        <form
          className="flex flex-col w-2/3 max-w-md gap-5 p-10 mx-auto mt-5 bg-[#] border-[#FFFF00] border-0 rounded-lg text-white"
          onSubmit={handleFormSubmit}
        >
          <p className="font-bold text-center text-3xl font-sans text-[#FFFF00]">Sign Up</p>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <label for="email" className="text-white">
                Email
              </label>
              <label className="text-red-600 ml-auto">
                Invalid email format
              </label>
            </div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <label for="email" className="text-white">
                Name
              </label>
            </div>
            <input
              id="name"
              type="text"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label for="password" className="text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
            <PasswordStrengthBar password={password} className="-mb-4" />
          </div>
          <div className="flex flex-col gap-2">
            <label for="confirm_password" className="text-white">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              type="password"
              placeholder="Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-white transition-colors duration-150 bg-black rounded-md hover:bg-black/70"
          >
            Sign Up
          </button>

        </form>
      </section>
    </div>
  );
}
