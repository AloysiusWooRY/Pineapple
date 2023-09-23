import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import PasswordStrengthBar from 'react-password-strength-bar';
import validator from "validator";

import Logo from "../assets/logo-no-background.png";

export default function Login() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [score, setScore] = useState(0)

  const [emailErr, setEmailErr] = useState(null)
  const [passwordErr, setPasswordErr] = useState(null)
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(null)
  const [error, setError] = useState(null)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    clearAllErrorMsg()
    const toastId = toast.loading('Loading...')

    const email = e.target.email.value
    if (!validator.isEmail(email)) {
      toast.error("Invalid email", { id: toastId })
      return setEmailErr("Invalid email")
    }

    if (score < 2) {
      toast.error("Password not strong", { id: toastId })
      return setPasswordErr("Password not strong")
    }

    const confirmPassword = e.target.confirm_password.value
    if (confirmPassword !== password) {
      toast.error("Password not matching", { id: toastId })
      return setConfirmPasswordErr("Password not matching")
    }

    const name = e.target.name.value

    try {
      setIsLoading(true)

      const response = await fetch(`http://localhost:4000/api/account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, email, password
        }),
      });
      const json = await response.json()

      if (response.ok) {
        toast.success("Success!", { id: toastId })
        navigate("..")
      } else {
        const errorMsg = json.error
        toast.error(errorMsg, { id: toastId })
        if (json.error === "Missing fields") setError(errorMsg)
        if (json.error === "Invalid email") setEmailErr(errorMsg)
        if (json.error === "Email already exist") setEmailErr(errorMsg)
        if (json.error === "Password not strong") setPasswordErr(errorMsg)
      }
    } catch (error) {
      const errorMsg = "Something went wrong, try again later!"
      toast.error(errorMsg, { id: toastId })
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  };

  const clearAllErrorMsg = () => {
    setError(null)
    setConfirmPasswordErr(null)
    setEmailErr(null)
    setPasswordErr(null)
  }

  const onChangeScore = (score, feedback) => {
    setScore(score)
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
          <p className="font-bold text-center text-3xl font-sans text-[#FFFF00]">Sign Up</p>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <label for="email" className="text-white">
                Email
              </label>
              <label className="text-red-600 ml-auto">
                {emailErr ?? ""}
              </label>
            </div>
            <input
              id="email"
              type="email"
              placeholder="Email"
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
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <label for="password" className="text-white">
                Password
              </label>
              <label className="text-red-600 ml-auto">
                {passwordErr ?? ""}
              </label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
            <PasswordStrengthBar
              password={password}
              className="-mb-4"
              onChangeScore={onChangeScore}
              barColors={['#ddd', '#FF0000', '#FFA500', '#00FF00', '#0000FF']}
              scoreWords={['Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong']}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <label for="confirm_password" className="text-white">
                Confirm Password
              </label>
              <label className="text-red-600 ml-auto">
                {confirmPasswordErr ?? ""}
              </label>
            </div>
            <input
              id="confirm_password"
              type="password"
              placeholder="Password"
              className="p-2 rounded-sm ring-2 ring-gray-300 text-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-white transition-colors duration-150 bg-black rounded-md hover:bg-black/70"
            >
              Sign Up
            </button>
            <label className="text-red-600 text-right">
              {error ?? ""}
            </label>
          </div>
        </form>
      </section>
    </div>
  );
}
