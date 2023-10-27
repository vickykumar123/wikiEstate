import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import { formatCurrency } from "../utils/helper";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState({});
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const { listingId } = params;
        const res = await fetch(`/api/v1/listing/${listingId}`);
        const data = await res.json();
        if (data.status === "failed") throw new Error(data.message);

        if (data.status === "success") {
          setListing(data.listing);
          setLoading(false);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast(err);
      }
    }
    fetchDetails();
  }, [params]);

  if (loading) return <Loader />;

  return (
    <main>
      {listing && !loading && (
        <>
          <Swiper navigation>
            {listing.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold text-violet-700">
              {listing.name} - {formatCurrency(listing.regularPrice)}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-violet-600  text-sm italic">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {formatCurrency(
                    +listing.regularPrice - +listing.discountPrice
                  )}{" "}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            <p className="font-semibold">Owner Info</p>
            <div className="flex gap-2  ">
              <img
                src={listing.user?.avatar}
                alt="profile"
                className="w-12 h-12 rounded-full "
              />
              <div>
                <p className="font-bold">{listing.user?.username}</p>
                <p className="text-sm italic">{listing.user?.email}</p>
              </div>
            </div>
            {currentUser &&
              listing.user?._id !== currentUser?._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-violet-700 text-white p-3 m-3 rounded-md hover:opacity-80"
                >
                  Contant Landlord
                </button>
              )}
            {!currentUser && (
              <Link
                to="/login"
                className="text-center text-red-700 font-bold text-xl hover:underline hover:opacity-70"
              >
                Click here to Log in to contant the landlord
              </Link>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
}
