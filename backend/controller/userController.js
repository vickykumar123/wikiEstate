import Listing from "../model/listingModel.js";
import User from "../model/userModel.js";
import { appError } from "../utils/appError.js";

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.Id)
      return next(
        appError(
          403,
          "You are not authorized to make changes to others account"
        )
      );

    const user = await User.findById(req.user.id);

    user.avatar = req.body.avatar || user.avatar;
    user.username = req.body.username || user.username;

    if (req.body.password || req.body.passwordConfirm) {
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();
    }

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: "success",
      message: "User updated successfully..",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.Id)
      return next(
        appError(
          403,
          "You are not authorized to make changes to others account"
        )
      );
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("token");
    res.status(201).json({
      status: "success",
      message: "User deleted successfully...",
    });
  } catch (err) {
    next(err);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.Id)
      return next(appError(400, "You can get your own listing"));

    const userListing = await Listing.find({ user: req.params.Id });
    res.status(200).json({
      status: "success",
      userListing,
    });
  } catch (error) {
    next(error);
  }
};
