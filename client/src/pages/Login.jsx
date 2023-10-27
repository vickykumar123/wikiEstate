import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { LockClosedIcon } from "@heroicons/react/24/solid";

import PasswordToggle from "../components/PasswordToggle";
import {
  finishLoading,
  signInOrUpdateSuccess,
  startLoading,
} from "../reduxState/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function Login() {
  const [formData, setFormData] = useState({});
  const isLoading = useSelector((state) => state.user.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(startLoading());
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.status === "failed") throw new Error(data.message);
      const user = data.user;

      if (data.status === "success") {
        dispatch(signInOrUpdateSuccess(user));
        toast("🥳 Logged in successfully.");
        navigate("/");
      }
    } catch (err) {
      // console.log(err);
      dispatch(finishLoading());
      toast(`🚫🚫 ${err}`);
    } finally {
      dispatch(finishLoading());
    }
  }

  return (
    <div className="max-w-xl align-middle p-3 mx-auto h-screen">
      <div className="flex flex-col mb-5">
        <h1 className="text-center font-semibold my-7 text-violet-900">
          Login
        </h1>
        <LockClosedIcon className="h-[60px]  text-violet-700" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
          name="email"
          id="email"
          required
          onChange={handleChange}
        />

        <PasswordToggle
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />

        <button
          disabled={isLoading}
          type="submit"
          className="bg-violet-500 p-3 rounded-lg hover:opacity-90 disabled:opacity-50 "
        >
          {isLoading ? "Logging..." : "Login"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="font-semibold text-violet-800">Don't have an account?</p>
        <Link to="/signup">
          <span className="text-blue-900 hover:underline">Signup</span>
        </Link>
      </div>
    </div>
  );
}
