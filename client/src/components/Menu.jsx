import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAnimeSearch } from "../../service/api"; // Pastikan path-nya benar sesuai struktur folder Anda

const Menu = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);

  // Fungsi untuk menutup suggestions saat mengklik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions saat user mengetik
  // Fetch suggestions saat user mengetik
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getAnimeSearch(search.trim(), 1);
        console.log("Search response:", response); // Log respons untuk debugging

        // Sesuaikan dengan struktur data yang sebenarnya (animeList, bukan results)
        if (response && response.data && Array.isArray(response.data.animeList)) {
          // Batasi jumlah saran yang ditampilkan ke 5 item
          const limitedResults = response.data.animeList.slice(0, 5);
          setSuggestions(limitedResults);
        } else if (response && Array.isArray(response.animeList)) {
          // Alternatif jika response.data tidak ada
          const limitedResults = response.animeList.slice(0, 5);
          setSuggestions(limitedResults);
        } else {
          console.error("Format respons tidak dikenali:", response);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Gunakan debounce untuk mengurangi request ke API
    const timeoutId = setTimeout(() => {
      if (search.trim()) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (animeId) => {
    navigate(`/anime/${animeId}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 px-2 mb-3">
      {/* Container untuk menu */}
      <ul className="flex flex-wrap justify-between w-full items-center">
        {/* Menu items */}
        <div className="flex flex-wrap justify-end gap-4 md:gap-8 text-white font-bold text-sm md:text-base items-center">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/on-going" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              ON-GOING
            </NavLink>
          </li>
          <li>
            <NavLink to="/anime-list" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              POPULAR
            </NavLink>
          </li>
          <li>
            <NavLink to="/jadwal-rilis" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              JADWAL RILIS
            </NavLink>
          </li>
          <li>
            <NavLink to="/genre-list" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              GENRE LIST
            </NavLink>
          </li>
        </div>

        {/* Search form dengan suggestions */}
        <li className="flex-grow-0 flex-shrink-0 relative" ref={suggestionRef}>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search anime..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="p-1 border border-gray-300 rounded-l-md text-white bg-transparent w-full md:w-64"
            />
            <button type="submit" className="bg-blue-500 text-white px-3 rounded-r-md hover:bg-blue-600 transition">
              Search
            </button>
          </form>

          {/* Suggestion Box */}
          {showSuggestions && search.trim().length > 1 && (
            <div className="absolute z-50 w-full md:w-64 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-96 overflow-hidden">
              {loading ? (
                <div className="p-3 text-center text-gray-400">Loading...</div>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((anime, index) => (
                    <div key={anime.animeId || anime.id || `anime-${index}`} className="p-2 border-b border-gray-700 hover:bg-gray-700 cursor-pointer" onClick={() => handleSuggestionClick(anime.animeId || anime.slug)}>
                      <div className="flex items-start space-x-2">
                        <div className="w-12 h-16 flex-shrink-0 overflow-hidden">
                          <img
                            src={anime.poster || anime.image || anime.thumbnail || "/placeholder-image.jpg"}
                            alt={anime.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{anime.title}</div>
                          <div className="text-xs text-gray-400">{[anime.type, anime.status].filter(Boolean).join(", ")}</div>
                          {anime.score && <div className="text-xs text-yellow-400">★ {anime.score}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 text-center bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer transition" onClick={handleViewAllResults}>
                    View all results {search}
                  </div>
                </>
              ) : (
                <div className="p-3 text-center text-gray-400">No results found</div>
              )}
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Menu;
