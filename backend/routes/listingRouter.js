import express from "express";
import {
  createListing,
  getAllListing,
  getListing,
  deleteListing,
  updateListing,
  searchListing,
} from "../controller/listingController.js";
import { protect } from "../controller/authcontroller.js";

const listingRouter = express.Router();

listingRouter.get("/", protect, getAllListing);
listingRouter.get("/search", searchListing);
listingRouter.get("/:Id", getListing);
listingRouter.post("/createListing", protect, createListing);
listingRouter.delete("/delete/:Id", protect, deleteListing);
listingRouter.patch("/update/:Id", protect, updateListing);

export default listingRouter;
