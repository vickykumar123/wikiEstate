import Listing from "../model/listingModel.js";
import { appError } from "../utils/appError.js";

export const createListing = async (req, res, next) => {
  try {
    if (!req.body.user) req.body.user = req.user.id;

    if (+req.body.regularPrice < +req.body.discountPrice)
      return next(
        appError(400, "Regular Price should be greater than discount price")
      );

    if (req.body.imageUrls.length < 1)
      return next(appError(400, "Please provide atleast 1 image"));

    const listing = await Listing.create(req.body);
    res.status(201).json({
      status: "success",
      listing,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllListing = async (req, res, next) => {
  try {
    const listing = await Listing.find();
    res.status(200).json({
      status: "success",
      result: listing.length,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.Id);
    if (!listing) return next(appError(404, "No Listing Found"));
    res.status(200).json({
      status: "success",
      listing,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.Id);
  if (!listing) return next(appError(404, "Listing Not Found..."));

  if (req.user.id !== listing.user.id)
    return next(appError(403, "You can delete your own listing."));

  try {
    await Listing.findByIdAndDelete(req.params.Id);

    res.status(201).json({
      status: "success",
      message: "Listing deleted successfully...",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.Id);
  if (!listing) return next(appError(404, "Listing Not Found..."));

  if (req.user.id !== listing.user.id)
    return next(appError(403, "You can edit your own listing."));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.Id,
      req.body,
      { new: true }
    );
    res.status(201).json({
      status: "success",
      updatedListing,
    });
  } catch (err) {
    next(err);
  }
};

export const searchListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";
    const listings = await Listing.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ],
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
