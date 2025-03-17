import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    // Load watch history from localStorage
    const loadWatchHistory = () => {
      try {
        const historyData = localStorage.getItem("animeWatchHistory");
        if (historyData) {
          // Parse and sort by last watched date (most recent first)
          const parsedHistory = JSON.parse(historyData);
          const sortedHistory = parsedHistory.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
          setWatchHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Error loading watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchHistory();
  }, []);

  const clearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat tontonan?")) {
      localStorage.removeItem("animeWatchHistory");
      setWatchHistory([]);
    }
  };

  const removeFromHistory = (episodeId) => {
    const updatedHistory = watchHistory.filter((item) => item.episodeId !== episodeId);
    localStorage.setItem("animeWatchHistory", JSON.stringify(updatedHistory));
    setWatchHistory(updatedHistory);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = watchHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(watchHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 bg-gray-900 text-gray-200 min-h-screen py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Riwayat Tontonan</h1>
        {watchHistory.length > 0 && (
          <button onClick={clearHistory} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
            Hapus Semua
          </button>
        )}
      </div>

      {watchHistory.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-lg mb-4">Belum ada anime yang ditonton</p>
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Jelajahi Anime
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <div key={`${item.episodeId}-${item.watchedAt}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-md relative">
                <Link to={`/watch/${item.episodeId}`}>
                  <img src={item.poster || "/placeholder-image.jpg"} alt={item.title} className="w-full h-40 sm:h-48 object-cover" />
                  <div className="p-3">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.animeName ? `${item.animeName} • ` : ""}
                      {new Date(item.watchedAt).toLocaleString()}
                    </p>
                  </div>
                </Link>
                <button onClick={() => removeFromHistory(item.episodeId)} className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white p-1 rounded-full hover:bg-red-500" title="Hapus dari riwayat">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"}`}>
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WatchHistory;
