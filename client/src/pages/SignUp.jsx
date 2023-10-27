import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import PasswordToggle from "../components/PasswordToggle";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status === "failed") throw new Error(data.message);
      // console.log(data);

      if (data.status === "success") {
        setIsLoading(false);
        toast("Siggned up successfully🥳");
        navigate("/login");
      }
    } catch (err) {
      setIsLoading(false);
      toast(`🚫 ${err.message} `);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl align-middle p-3 mx-auto h-screen">
      <div className="flex flex-col">
        <h1 className="text-center font-semibold my-7 text-violet-900">
          Sign Up
        </h1>
        <UserCircleIcon className="h-[60px]  text-violet-700" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
          name="username"
          id="username"
          required
          onChange={handleChange}
        />
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
        <PasswordToggle
          placeholder="Confirm Password"
          name="passwordConfirm"
          onChange={handleChange}
        />

        <button
          disabled={isLoading}
          type="submit"
          className="bg-violet-500 p-3 rounded-lg hover:opacity-90 disabled:opacity-50 "
        >
          {isLoading ? "Signning...." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="font-semibold text-violet-800">
          Already have an account?
        </p>
        <Link to="/login">
          <span className="text-blue-900 hover:underline">Login</span>
        </Link>
      </div>
    </div>
  );
}
