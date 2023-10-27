import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import ListingItem from "./ListingItem";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showmore, setShowmore] = useState(false);
  // console.log(listing);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    //Fetching listing....

    async function fetchDetails() {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/v1/listing/search?${searchQuery}`);
      const data = await response.json();
      // console.log(data.length, listing.length);
      if (data.length > 8) setShowmore(true); // less than page limit
      else setShowmore(false);
      setListing(data);
      setLoading(false);
    }

    fetchDetails();
  }, [window.location.search]);
  // this needs to there, otherwise it will not work as expected

  const onShowMoreClick = async () => {
    const numberOfListing = listing.length;
    const startIndex = numberOfListing;
    // console.log(startIndex);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await fetch(`/api/v1/listing/search?${searchQuery}`);
    const data = await response.json();
    // console.log(data.length);
    if (data.length < 9) setShowmore(false); // greater than page limit
    setListing([...listing, ...data]);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="p-2 border-b-2 md:border-r-4 md:min-h-screen md:max-w-xl w-full sm:w-[1200px]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 md:gap-3 m-5"
          >
            <div className="flex items-center gap-3 border-[2px] border-violet-300 p-3  rounded-md ">
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search with Place or Name..."
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-violet-400 focus:ring-offset-1 focus:ring placeholder:text-sm placeholder:italic"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-3 flex-wrap border-[2px] border-violet-300 p-3  rounded-md">
              <label className="font-semibold">Type: </label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5 rounded-sm"
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                />
                <span className="italic">Rent & Sale</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5 rounded-sm"
                  onChange={handleChange}
                  checked={sidebarData.type === "rent"}
                />
                <span className="italic">Rent</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5 rounded-sm"
                  onChange={handleChange}
                  checked={sidebarData.type === "sale"}
                />
                <span className="italic">Sale</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5 rounded-sm"
                  onChange={handleChange}
                  checked={sidebarData.offer}
                />
                <span className="italic">Offer</span>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap border-[2px] border-violet-300 p-3  rounded-md">
              <label className="font-semibold">Amenities: </label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 rounded-sm"
                  onChange={handleChange}
                  checked={sidebarData.parking}
                />
                <span className="italic">Parking</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 rounded-sm"
                  onChange={handleChange}
                  checked={sidebarData.furnished}
                />
                <span className="italic">Furnished</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-[2px] border-violet-300 p-3  rounded-md">
              <label className="font-semibold whitespace-nowrap">
                Sort By:{" "}
              </label>
              <select
                onChange={handleChange}
                defaultValue="createdAt_desc"
                id="sort_order"
                className="p-2 rounded-lg"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-violet-500 p-3 rounded-lg hover:opacity-90 text-white">
              Search
            </button>
          </form>
        </div>
        <div className="p-2">
          <h1 className="text-3xl p-2 font-sans font-semibold text-violet-600">
            Listing results:{" "}
            <span className="text-2xl italic text-violet-900">
              "{sidebarData.searchTerm}"
            </span>
          </h1>
          <div className="flex gap-3 flex-wrap p-4">
            {!loading && listing.length === 0 && (
              <p className="p-3 font-medium text-violet-600">
                No Results Found ⛔
              </p>
            )}
            {!loading &&
              listing &&
              listing.map((lists) => (
                <ListingItem key={lists._id} listing={lists} />
              ))}
          </div>
          {showmore && (
            <button
              className="text-green-500 p-3 font-semibold hover:underline hover:opacity-80"
              onClick={onShowMoreClick}
            >
              Show More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
