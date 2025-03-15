import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPopularAnime } from "../../service/api";

const AnimePopular = () => {
  const [popularAnime, setPopularAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getPopularAnime(page);
      console.log("API Response:", response); // Log the response for debugging

      if (response && response.data) {
        // Check if the anime list exists in the response
        if (response.data.animeList) {
          setPopularAnime(response.data.animeList);
        } else {
          throw new Error("Anime list not found in response");
        }

        // Check if pagination data exists in the response
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          throw new Error("Pagination data not found in response");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch anime data: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    window.scrollTo(0, 0);
    fetchData(page); // Panggil fetchData dengan halaman yang sesuai
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  return (
    <div className="container mx-auto p-2">
      <section className="mb-8">
        <h1 className="text-xl font-bold mb-4 pb-2 border-b">Anime Populer</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
          {popularAnime.map((anime) => (
            <Link key={anime.animeId} to={`/anime/${anime.animeId}`} className="relative border rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer">
              {/* Anime Image */}
              <img src={anime.poster} alt={anime.title} className="w-full h-[160px] object-cover" />

              {/* Episode Label */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded"> ★ {anime.score}</div>

              {/* Release Date */}
              <div className="absolute top-6 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">{anime.status}</div>

              {/* Anime Title Overlay */}
              <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white text-xs text-center p-1">{anime.title}</div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 gap-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2 rounded-md ${pagination.hasPrevPage ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            &laquo; Prev
          </button>

          {/* Page Info */}
          <div className="px-4 py-2">
            <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded-md ${pagination.hasNextPage ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Next &raquo;
          </button>
        </div>
      </section>
    </div>
  );
};

export default AnimePopular;
