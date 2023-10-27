import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [validator.isEmail, "Please provide valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: 8,
      max: 50,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not same!!",
      },
    },
    avatar: {
      type: String,
      default: "https://ca.slack-edge.com/T0266FRGM-U2Q173U05-g863c2a865d7-512",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //This will run only if password is modified
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
