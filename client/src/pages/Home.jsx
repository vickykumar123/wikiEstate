import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { finishLoading, startLoading } from "../reduxState/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import ListingItem from "./ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);
  // console.log(offerListings);

  useEffect(() => {
    async function fetchOfferListing() {
      try {
        dispatch(startLoading());
        const response = await fetch(
          "/api/v1/listing/search?offer=true&limit=4"
        );
        const data = await response.json();
        setOfferListings(data);
        fetchRentListing();
        dispatch(finishLoading());
      } catch (err) {
        dispatch(finishLoading());
        console.log(err);
      }
    }

    async function fetchRentListing() {
      try {
        const response = await fetch(
          "/api/v1/listing/search?type=rent&limit=4"
        );
        const data = await response.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (err) {
        console.log(err);
      }
    }

    async function fetchSaleListing() {
      try {
        const response = await fetch(
          "/api/v1/listing/search?type=sale&limit=4"
        );
        const data = await response.json();
        setSaleListings(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchOfferListing();
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          wiki Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper */}

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing, i) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              >
                {/* {console.log(listing)} */}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-bold text-violet-600">
                Recent offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-sm font-medium hover:underline italic text-violet-500 my-3"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-bold text-violet-600">
                Recent Rents
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-sm font-medium hover:underline italic text-violet-500 my-3"
              >
                Show more rents
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Sale */}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-bold text-violet-600">
                Recent Sales
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-sm font-medium hover:underline italic text-violet-500 my-3"
              >
                Show more sales
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
