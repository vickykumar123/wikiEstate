import { Link, Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <footer className="hidden sm:flex justify-between bg-violet-200 p-3 bottom-0 text-end w-full  mt-10 ">
        <Link to="/" className="mx-auto">
          <h2 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500 ">wiki</span>
            <span className="text-violet-400 ">Estate 🏡</span>
          </h2>
        </Link>
        <span className="text-violet-700 font-bold mx-auto">
          &copy; By Vicky Kumar {new Date().getFullYear()}
        </span>
      </footer>
    </>
  );
}
