import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAnimeSearch } from "../../service/api";

const Menu = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getAnimeSearch(search.trim(), 1);
        console.log("Search response:", response);

        if (response && response.data && Array.isArray(response.data.animeList)) {
          const limitedResults = response.data.animeList.slice(0, 5);
          setSuggestions(limitedResults);
        } else if (response && Array.isArray(response.animeList)) {
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
      setMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (animeId) => {
    navigate(`/anime/${animeId}`);
    setSearch("");
    setShowSuggestions(false);
    setMobileMenuOpen(false);
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setShowSuggestions(false);
    setMobileMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full px-2 mb-3">
      {/* Mobile menu button */}
      <div className="flex items-center justify-between py-2 md:hidden">
        <button className="text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* Mobile search form */}
        <div className="relative flex-grow max-w-xs mx-2" ref={suggestionRef}>
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
              className="p-1 border border-gray-300 rounded-l-md text-white bg-transparent w-full"
            />
            <button type="submit" className="bg-blue-500 text-white px-2 rounded-r-md hover:bg-blue-600 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Mobile suggestions */}
          {showSuggestions && search.trim().length > 1 && (
            <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-96 overflow-hidden">
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
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div ref={mobileMenuRef} className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden absolute z-40 left-0 right-0 bg-gray-900 border border-gray-700 shadow-lg rounded-md`}>
        <ul className="flex flex-col p-2">
          <li className="py-2 border-b border-gray-700">
            <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400 text-white")} onClick={handleMenuItemClick}>
              HOME
            </NavLink>
          </li>
          <li className="py-2 border-b border-gray-700">
            <NavLink to="/on-going" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400 text-white")} onClick={handleMenuItemClick}>
              ON-GOING
            </NavLink>
          </li>
          <li className="py-2 border-b border-gray-700">
            <NavLink to="/popular" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400 text-white")} onClick={handleMenuItemClick}>
              POPULAR
            </NavLink>
          </li>
          <li className="py-2 border-b border-gray-700">
            <NavLink to="/jadwal-rilis" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400 text-white")} onClick={handleMenuItemClick}>
              JADWAL RILIS
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/history" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400 text-white")} onClick={handleMenuItemClick}>
              HISTORY
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Desktop menu and search */}
      <div className="hidden md:flex flex-wrap justify-between w-full items-center">
        {/* Menu items */}
        <div className="flex flex-wrap justify-end gap-4 md:gap-8 text-white font-bold text-sm md:text-base items-center ">
          <li className="list-none">
            <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              HOME
            </NavLink>
          </li>
          <li className="list-none">
            <NavLink to="/on-going" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              ON-GOING
            </NavLink>
          </li>
          <li className="list-none">
            <NavLink to="/popular" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              POPULAR
            </NavLink>
          </li>
          <li className="list-none">
            <NavLink to="/jadwal-rilis" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              JADWAL RILIS
            </NavLink>
          </li>
          <li className="list-none">
            <NavLink to="/history" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
              HISTORY
            </NavLink>
          </li>
        </div>

        {/* Desktop search form with suggestions */}
        <li className="flex-grow-0 flex-shrink-0 relative list-none" ref={suggestionRef}>
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

          {/* Suggestion Box for desktop */}
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
      </div>
    </div>
  );
};

export default Menu;
