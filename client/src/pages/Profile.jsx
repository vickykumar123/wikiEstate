import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import PasswordToggle from "../components/PasswordToggle";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import toast from "react-hot-toast";
import {
  startLoading,
  finishLoading,
  signInOrUpdateSuccess,
  deleteOrLogoutUserSuccess,
} from "../reduxState/userSlice";
import { Link, useNavigate } from "react-router-dom";
import UserListing from "../components/UserListing";
import Loader from "./Loader";

export default function Profile() {
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [userListing, setUserListing] = useState([]);
  const { currentUser, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log(formData);

  // console.log(file);

  const handleFileUpload = useCallback(
    (file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePercent(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setFormData({ ...formData, avatar: downloadURL })
          );
        }
      );
      setFile(undefined);
    },
    [formData]
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  if (loading) return <Loader />;
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(startLoading());
      const response = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status === "failed") throw new Error(data.message);
      const user = data.user;

      if (data.status === "success") {
        dispatch(signInOrUpdateSuccess(user));
        toast("🥳 Updated the user data successfully.");
        setFormData({});
      }
    } catch (err) {
      // console.log(err);
      dispatch(finishLoading());
      toast(`🚫🚫 ${err}`);
    } finally {
      dispatch(finishLoading());
    }
  };

  const handleDelete = async function () {
    try {
      let confirmDelete = window.confirm(
        "Are you sure, You want to delete the Account??"
      );
      if (confirmDelete) {
        dispatch(startLoading());
        const response = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.status === "failed") throw new Error(data.message);

        if (data.status === "success") {
          dispatch(deleteOrLogoutUserSuccess());
          toast("User Deleted successfully...");
          window.localStorage.clear();
        }
      }
    } catch (err) {
      // console.log(err);
      dispatch(finishLoading());
      toast(`🚫🚫 ${err}`);
    } finally {
      dispatch(finishLoading());
    }
  };

  const handleUserListing = async () => {
    try {
      const response = await fetch(`/api/v1/user/listing/${currentUser._id}`);
      const data = await response.json();
      console.log(data);
      if (data.status === "failed") throw new Error(data.message);
      setUserListing(data.userListing);
    } catch (err) {
      toast(err);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/v1/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "failed") throw new Error(data.message);

      if (data.status === "success") {
        setUserListing((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        toast(data.message);
      }
    } catch (err) {
      toast(err);
    }
  };

  return (
    <div className="p-3">
      <h1 className="font-semibold text-violet-700 text-center my-7">
        My Profile
      </h1>
      <div className="max-w-xl align-middle p-3 mx-auto">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="Profile Pic"
            className="rounded-full self-center my-3 cursor-pointer object-cover w-[120px] h-[120px]"
          />

          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePercent > 0 && filePercent < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
            ) : filePercent === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1 cursor-not-allowed opacity-90"
            name="email"
            defaultValue={currentUser.email}
            disabled
          />
          <input
            type="username"
            className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
            name="username"
            id="username"
            defaultValue={currentUser.username}
            required
            onChange={handleChange}
            disabled={loading}
          />

          <PasswordToggle
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required={false}
            disabled={loading}
          />

          <PasswordToggle
            placeholder="Password Confirm"
            name="passwordConfirm"
            onChange={handleChange}
            required={false}
            disabled={loading}
          />

          <button
            type="submit"
            className="bg-violet-500 p-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <Link
            className="bg-green-400 text-white uppercase rounded-lg text-center p-3 hover:opacity-80"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-4">
          <span
            className="bg-red-500 rounded-md p-2 text-slate-100 cursor-pointer hover:opacity-80"
            onClick={handleDelete}
          >
            Delete Account
          </span>
          <span
            className="text-slate-100  bg-slate-700 cursor-pointer rounded-md p-2 hover:opacity-80"
            onClick={() => dispatch(deleteOrLogoutUserSuccess())}
          >
            Logout
          </span>
        </div>
        <div className="p-2 mt-7 text-center">
          <button
            className="bg-pink-600 p-3 rounded-md text-white hover:opacity-80 font-semibold"
            onClick={handleUserListing}
          >
            Show My Listings
          </button>
        </div>
        <UserListing
          userListing={userListing}
          handleDeleteListing={handleDeleteListing}
        />
      </div>
    </div>
  );
}
