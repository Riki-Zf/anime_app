import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAnimeSearch } from "../../service/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getAnimeSearch(query, page);
        console.log("Search results response:", response);

        // Sesuaikan dengan struktur data yang sebenarnya (animeList, bukan results)
        if (response && response.data) {
          // Simpan hasil pencarian - sesuaikan dengan struktur data dari API
          setResults(response.data.animeList || []);

          // Simpan jumlah halaman dari pagination jika tersedia
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 1);
          }
        } else {
          throw new Error("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil hasil pencarian");
        console.error("Error saat fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  // Reset page to 1 when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  if (!query) {
    return (
      <div className="container mx-auto p-4 bg-gray-900 text-gray-200 min-h-screen">
        <div className="text-center py-8">Silakan masukkan kata kunci pencarian</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-6 pb-2 border-b border-gray-700">Hasil Pencarian: {query}</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-8">Tidak ada hasil yang ditemukan untuk "{query}"</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((anime, index) => (
              <Link to={`/anime/${anime.animeId || anime.slug}`} key={anime.animeId || anime.slug || `anime-${index}`} className="group">
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:transform group-hover:scale-105">
                  <div className="relative pb-[140%]">
                    <img
                      src={anime.poster || anime.image || anime.thumbnail || "/placeholder-image.jpg"}
                      alt={anime.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    {anime.episodeTotal && <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Ep {anime.episodeTotal}</div>}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2">{anime.title}</h3>
                    {anime.score && (
                      <div className="flex items-center mt-1 text-xs text-yellow-400">
                        <span>⭐ {anime.score}</span>
                      </div>
                    )}
                    {anime.type && <div className="text-xs text-gray-400 mt-1">{anime.type}</div>}
                    {anime.status && <div className="text-xs text-gray-400">{anime.status}</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <button onClick={handlePrevPage} disabled={page === 1} className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                Sebelumnya
              </button>
              <div className="flex items-center px-4">
                Halaman {page} dari {totalPages}
              </div>
              <button onClick={handleNextPage} disabled={page === totalPages} className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
