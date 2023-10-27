import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const { user: landlord } = listing;
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  // console.log(landlord);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold">"{listing.name}"</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here to send..."
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-violet-400 focus:ring-offset-1 focus:ring"
          />
          {message && (
            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
              className="bg-violet-700 text-white p-3 text-center w-full rounded-md hover:opacity-80"
            >
              Send Message
            </Link>
          )}
        </div>
      )}
    </>
  );
}
