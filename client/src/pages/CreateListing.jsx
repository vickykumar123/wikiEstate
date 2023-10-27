import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { TrashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState({});
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // console.log(files);
  // console.log(formData);

  const handleImageSubmit = () => {
    const fileLength = files.length;
    if (fileLength > 0 && fileLength + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < fileLength; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
      });
      setImageUploadError(null);
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-houseImage-" + file.name;
      const storageRef = ref(storage, "houses/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadPercent(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              console.log("");
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        throw Error("Please upload atleast 1 image");

      setLoading(true);
      const response = await fetch("/api/v1/listing/createListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      // console.log(data);
      const { listing } = data;
      if (data.status === "failed") throw Error(data.message);

      if (data.status === "success") {
        toast("Listing created successfully 🥳");
        navigate(`/listing/${listing._id}`);
        setFormData({});
      }
      setLoading(false);
    } catch (error) {
      toast(` ${error}`);
      setLoading(false);
    }
  }

  function handleChange(e) {
    // console.log(e.target);
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    //----------
    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    //----------

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  }

  return (
    <main className="h-screen">
      <h1 className="font-semibold text-center text-violet-600 my-7 font-mono">
        Create Listing <span className="text-3xl">📑</span>
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
        {/* Listing Details Deta */}
        <div className="flex flex-col gap-4 p-5 sm:w-[50%] m-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset- "
            name="name"
            id="name"
            minLength="10"
            maxLength="60"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1 "
            name="description"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg  focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1 "
            name="address"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-3 border border-violet-300 px-3 rounded-md">
              <div className="flex gap-2">
                <input
                  type="radio"
                  id="sale"
                  className="w-5 "
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span className="text-violet-500 font-medium">Sale</span>
              </div>
              OR
              <div className="flex gap-2">
                <input
                  type="radio"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span className="text-violet-500 font-medium">Rent</span>
              </div>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span className="text-violet-500 font-medium text-center">
                Parking Spot
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span className="text-violet-500 font-medium">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span className="text-violet-500 font-medium">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="50"
                required
                className="p-3 border border-violet-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms" className="text-violet-500 font-medium">
                Bedrooms
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="50"
                required
                className="p-3 border border-violet-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label
                htmlFor="bathrooms"
                className="text-violet-500 font-medium"
              >
                Bathrooms
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-violet-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex gap-2 sm:flex-col sm:gap-0 text-violet-500 font-medium items-center">
                <label htmlFor="regularPrice">Regular Price</label>
                <span className="text-sm">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="p-3 border border-violet-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300 focus:ring-offset-1"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex gap-2 sm:flex-col sm:gap-0 text-violet-500 font-medium items-center">
                  <label htmlFor="discountPrice">Discount Price</label>
                  <span className="text-sm">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* -------------------- */}
        <div className="  sm:border-l-4 sm:border-solid sm:border-violet-400 sm:h-[550px] sm:absolute sm:left-[53%] sm:ml-[-3px] sm:top-15"></div>
        {/* -------------------- */}

        {/* Image upload */}
        <div className="flex flex-col p-5 m-4">
          <p className="font-semibold text-violet-800">
            Images :
            <span className="font-normal text-violet-500 ml-2">
              The first image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 my-3">
            {/* Upload Button */}
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              accept="image/*"
              multiple
              className=" border border-violet-400 rounded-md w-full file:bg-violet-500 file:border-violet-700 file:rounded-md file:h-12 file:m-1 file:text-white dark:text-sm dark:text-violet-400 cursor-pointer"
              required
            />
            <button
              className="p-3 text-green-500 border border-green-700 rounded-md uppercase hover:bg-green-300 hover:text-white disabled:opacity-80"
              type="button"
              onClick={() => handleImageSubmit()}
            >
              Upload
            </button>
          </div>
          <p className="mt-1 text-xs  text-violet-500" id="file_input_help">
            * only PNG,JPEG or JPG (MAX. 800x400px).
          </p>
          {/* Uploading image */}
          <p className="text-sm self-center">
            {imageUploadError ? (
              <span className="text-red-700">
                {imageUploadError ||
                  "Error Image upload (image must be less than 6)"}
              </span>
            ) : uploadPercent > 0 && uploadPercent < 100 ? (
              <span className="text-slate-700">Uploading Please wait....</span>
            ) : uploadPercent === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="lisiting"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <TrashIcon
                  className="w-10 h-6 text-red-600 cursor-pointer"
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            ))}
          <button
            className="bg-violet-600 shadow-2xl p-3 rounded-md my-6 text-white uppercase disabled:opacity-80"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
