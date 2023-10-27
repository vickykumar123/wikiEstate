import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInOrUpdateSuccess } from "../reduxState/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });
      const data = await res.json();
      const user = data.user;
      if (data.status === "success") {
        dispatch(signInOrUpdateSuccess(user));
        toast("🥳 Logged in successfully.");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-400 p-3 rounded-lg uppercase text-white hover:opacity-90"
    >
      Continue with google
    </button>
  );
}
