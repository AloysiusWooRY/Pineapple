import React from "react";
import Logo from "../assets/logo-no-background.png";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (error) {

    }
  };

  const handleRecoverPass = () => {
    // window.location.href = "/forgot-password";
  };

  const handleRegister = () => {
    navigate("../register")
  }

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
          <p className="font-medium text-center text-xl">Welcome back!</p>
          <input
            id="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
          />
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:gap-0">
            <label className="flex items-center">
              <a
                onClick={handleRecoverPass}
                className="mr-1 cursor-pointer hover:text-[#FFFF00]"
              >
                Forgot your password?
              </a>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-white transition-colors duration-150 bg-black rounded-md hover:bg-black/70"
          >
            Log In
          </button>
          <div className="flex flex-col items-center justify-between gap-5 text-sm font-semibold">
            <label className="flex items-center">
              Do not have an account?
              <a
                onClick={handleRegister}
                className="ml-1 cursor-pointer text-[#FFFF00]"
              >
                Register
              </a>
            </label>
          </div>
        </form>
      </section>
    </div>
  );
}
