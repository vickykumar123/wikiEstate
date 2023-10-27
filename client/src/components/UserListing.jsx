import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/helper";

export default function UserListing({ userListing, handleDeleteListing }) {
  return (
    <ul className="divide-y divide-stone-300 px-2">
      {userListing &&
        userListing.length > 0 &&
        userListing.map((listing) => (
          <li key={listing._id} className="flex gap-4 py-2 justify-between">
            <Link to={`/listing/${listing._id}`} className="flex gap-2">
              <img
                src={listing.imageUrls[0]}
                alt="listing"
                className="h-24 rounded-[8px]"
              />

              <div className="flex flex-grow flex-col">
                <p className="text-xs font-semibold ">{listing.name}</p>
                <p className="text-xs capitalize italic text-stone-800">
                  Price :{formatCurrency(listing.regularPrice)}
                </p>
                <p className="text-xs capitalize italic text-stone-800">
                  Type: {listing.type}
                </p>
                <p className="text-xs capitalize italic text-stone-800">
                  Address: {listing.address}
                </p>
                <p className="text-xs capitalize italic text-stone-800">
                  {listing.discountPrice > 0 && (
                    <>Discount: {listing.discountPrice}</>
                  )}
                </p>
                <p className="text-xs capitalize italic text-stone-800">
                  Created on: {formatDate(listing.createdAt)}
                </p>
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <Link to={`/update-listing/${listing._id}`}>
                <button className="bg-green-500 p-1 rounded-md text-white text-sm hover:opacity-80 w-full">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDeleteListing(listing._id)}
                className="bg-red-400 p-1 rounded-md text-white text-sm hover:opacity-80"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
    </ul>
  );
}
