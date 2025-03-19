import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Set items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8); // Tablet
      } else {
        setItemsPerPage(12); // Desktop
      }
    };

    // Initial call
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Load watch history from localStorage
    const loadWatchHistory = () => {
      try {
        const historyData = localStorage.getItem("animeWatchHistory");
        console.log("Raw history data:", historyData);

        if (historyData) {
          // Parse and sort by last watched date (most recent first)
          const parsedHistory = JSON.parse(historyData);
          console.log("Parsed history:", parsedHistory);

          // Filter out any entries with undefined episodeId
          const validHistory = parsedHistory.filter((item) => item && item.episodeId);
          console.log("Valid history items:", validHistory.length);

          const sortedHistory = validHistory.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
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

  const removeFromHistory = (episodeId, event) => {
    // Prevent navigating to the episode when clicking the remove button
    event.stopPropagation();
    event.preventDefault();

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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const getEpisodeTitle = (item) => {
    if (!item.title) return "Episode";

    // Check if title already has "Episode" in it
    if (item.title.toLowerCase().includes("episode")) {
      return item.title;
    }

    return `Episode ${item.title}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 lg:px-6 bg-gray-900 text-gray-200 min-h-screen py-4 md:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Riwayat Tontonan</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex-grow sm:flex-grow-0 text-center">
            Kembali ke Beranda
          </Link>
          {watchHistory.length > 0 && (
            <button onClick={clearHistory} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex-grow sm:flex-grow-0">
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {watchHistory.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 text-center">
          <p className="text-lg mb-4">Belum ada anime yang ditonton</p>
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block">
            Jelajahi Anime
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {currentItems.map((item) => (
              <div key={`${item.episodeId}-${item.watchedAt}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-md relative hover:bg-gray-700 transition-colors">
                <Link to={`/watch/${item.episodeId}`} className="block h-full">
                  <div className="relative">
                    <img
                      src={item.poster || "/placeholder-image.jpg"}
                      alt={item.animeName || "Anime thumbnail"}
                      className="w-full h-36 sm:h-40 md:h-44 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">{getEpisodeTitle(item)}</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-2">{item.animeName || "Unknown Anime"}</h3>
                    <p className="text-xs text-gray-400 mt-1">Ditonton: {formatDate(item.watchedAt)}</p>
                  </div>
                </Link>
                <button
                  onClick={(e) => removeFromHistory(item.episodeId, e)}
                  className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                  title="Hapus dari riwayat"
                  aria-label="Hapus dari riwayat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 overflow-x-auto py-2">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {/* Previous button */}
                {currentPage > 1 && (
                  <button onClick={() => handlePageChange(currentPage - 1)} className="px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600" aria-label="Previous page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Dynamic page buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current page
                    return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {/* Add ellipsis if there's a gap */}
                      {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 py-1 text-gray-400">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                {/* Next button */}
                {currentPage < totalPages && (
                  <button onClick={() => handlePageChange(currentPage + 1)} className="px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600" aria-label="Next page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WatchHistory;
