import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { deleteOrLogoutUserSuccess } from "../reduxState/userSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    dispatch(deleteOrLogoutUserSuccess());
    toast("Logged Out successfully...📤🏃🏻");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-violet-200		">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
            <span className="text-slate-500 ">wiki</span>
            <span className="text-violet-400 ">Estate 🏡</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-violet-100 p-2 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search by Place or Name..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-violet-600" />
          </button>
        </form>
        <ul className="flex gap-4 sm:gap-6">
          <Link to="/">
            <li className="hidden sm:block text-base font-semibold text-violet-700 hover:text-violet-500">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:block text-base font-semibold text-violet-700 hover:text-violet-500">
              About
            </li>
          </Link>

          {user ? (
            <>
              <Link to="/profile">
                <img
                  className="rounded-full w-7 h-7 object-cover "
                  src={user.avatar}
                  alt="User Profile"
                />
              </Link>
              <ArrowRightOnRectangleIcon
                className="w-7 h-7 text-violet-900 cursor-pointer"
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <Link to="/login">
                <li className=" text-base font-semibold text-violet-700 hover:text-violet-500">
                  Login
                </li>
              </Link>
              <Link to="/signup">
                <li className=" text-base font-semibold text-violet-700 hover:text-violet-500">
                  Sign Up
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
