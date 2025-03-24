import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Matches() {
  const API_KEY = "5be04661-3a81-426d-b195-e16cc940ce43"
  const API_URL = "https://api.cricapi.com/v1/currentMatches";
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            apikey: API_KEY,
          },
        });

        if (response.data && response.data.data) {
          console.log(response.data);
          setMatches(response.data.data);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleCardClick = (seriesId) => {
    alert(`Series ID: ${seriesId}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Current Cricket Matches</h1>
      {loading ? (
        <p className="text-gray-600 text-center">Fetching matches, please wait...</p>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCardClick(match.series_id || 'Unknown')}
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{match.name || "Unknown Match"}</h2>
              <div className="text-gray-600 mb-2"><span className="font-bold">Type:</span> {match.matchType?.toUpperCase() || "N/A"}</div>
              <div className="text-gray-600 mb-2"><span className="font-bold">Status:</span> {match.status || "N/A"}</div>
              <div className="text-gray-600"><span className="font-bold">Venue:</span> {match.venue || "N/A"}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No matches available.</p>
      )}
    </div>
  );
}
