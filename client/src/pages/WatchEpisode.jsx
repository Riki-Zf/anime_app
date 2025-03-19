import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeEpisode, getAnimeServer, getAnimeDetail } from "../../service/api";

const WatchEpisode = () => {
  const { episodeId } = useParams();
  const [episodeDetail, setEpisodeDetail] = useState(null);
  const [animeDetail, setAnimeDetail] = useState(null); // Added for episode list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");

  useEffect(() => {
    const fetchEpisodeDetail = async () => {
      try {
        setLoading(true);
        const response = await getAnimeEpisode(episodeId);

        if (response && response.data) {
          setEpisodeDetail(response.data);
          setStreamingUrl(response.data.defaultStreamingUrl || "");
          setCurrentlyPlaying("Default Server");

          // Set default quality and server
          if (response.data.server && response.data.server.qualities.length > 0) {
            setSelectedQuality(response.data.server.qualities[0]);
            if (response.data.server.qualities[0].serverList.length > 0) {
              const defaultServer = response.data.server.qualities[0].serverList[0];
              setSelectedServer(defaultServer);

              // Fetch default server data if available
              if (defaultServer.serverId) {
                fetchServerData(defaultServer.serverId, defaultServer.title, response.data.server.qualities[0].title);
              }
            }
          }

          // Save to watch history
          saveToWatchHistory(response.data);

          // Fetch anime detail for episode list
          if (response.data.animeId) {
            fetchAnimeDetail(response.data.animeId);
          }
        } else {
          throw new Error("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil detail episode");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (episodeId) {
      fetchEpisodeDetail();
    }
  }, [episodeId]);

  // New function to fetch anime details including episode list
  const fetchAnimeDetail = async (animeId) => {
    try {
      const response = await getAnimeDetail(animeId);
      if (response && response.data) {
        setAnimeDetail(response.data);
      } else {
        console.error("Format data anime tidak sesuai");
      }
    } catch (err) {
      console.error("Gagal mengambil detail anime:", err);
    }
  };

  // Function to save episode to watch history
  // Function to save episode to watch history
  // Function to save episode to watch history
  const saveToWatchHistory = (episodeData) => {
    try {
      console.log("Attempting to save episode data:", episodeData);

      // Check if we have essential data
      if (!episodeData) {
        console.error("Missing episode data for watch history");
        return;
      }

      // Extract episodeId from URL if available or use the current episodeId from params
      const extractedEpisodeId = episodeData.episodeId || episodeId;

      if (!extractedEpisodeId) {
        console.error("Cannot extract episodeId for watch history");
        return;
      }

      // Get existing watch history or initialize empty array
      const existingHistory = JSON.parse(localStorage.getItem("animeWatchHistory") || "[]");

      // Create history item with required fields
      const historyItem = {
        episodeId: extractedEpisodeId,
        title: episodeData.title?.split(" Episode ")[1]?.split(" ")[0] || episodeData.title || "Unknown",
        poster: episodeData.poster || (episodeData.thumbnails && episodeData.thumbnails.length > 0 ? episodeData.thumbnails[0] : "/placeholder-image.jpg"),
        animeName: episodeData.animeName || episodeData.animeTitle || (episodeData.title ? episodeData.title.split(" Episode ")[0].trim() : "Unknown Anime"),
        animeId: episodeData.animeId || "",
        watchedAt: new Date().toISOString(),
      };

      // Log what we're saving for debugging
      console.log("Saving to watch history:", historyItem);

      // Remove this episode if it already exists in history
      const filteredHistory = existingHistory.filter((item) => item && item.episodeId && item.episodeId !== extractedEpisodeId);

      // Add the new item at the beginning
      const updatedHistory = [historyItem, ...filteredHistory];

      // Limit history to 100 items
      const limitedHistory = updatedHistory.slice(0, 100);

      // Save to localStorage
      localStorage.setItem("animeWatchHistory", JSON.stringify(limitedHistory));

      console.log("Successfully saved to watch history");
    } catch (error) {
      console.error("Error saving to watch history:", error);
    }
  };

  // Function to fetch server data when a server is selected
  const fetchServerData = async (serverId, serverTitle, qualityTitle) => {
    if (!serverId) return;

    try {
      setServerLoading(true);
      setServerError(null);
      console.log(`Fetching server data for: ${serverId}`);

      const response = await getAnimeServer(serverId);
      console.log("Server response:", response);

      if (response && response.data) {
        // Log the response for debugging
        console.log("Server data received:", response.data);

        // Update the streaming URL with the one from the server response
        let newStreamingUrl = "";
        if (response.data.streamingUrl) {
          newStreamingUrl = response.data.streamingUrl;
        } else if (response.data.href) {
          newStreamingUrl = response.data.href;
        } else if (response.data.url) {
          newStreamingUrl = response.data.url;
        }

        if (newStreamingUrl) {
          console.log(`Setting new streaming URL: ${newStreamingUrl}`);
          setStreamingUrl(newStreamingUrl);
          setCurrentlyPlaying(`${qualityTitle} - ${serverTitle}`);
        } else {
          console.error("No streaming URL found in server response");
          setServerError("Tidak ada URL streaming yang tersedia");
        }

        // Update the selected server with additional data
        setSelectedServer((prevServer) => ({
          ...prevServer,
          ...response.data,
        }));
      } else {
        throw new Error("Format data server tidak sesuai");
      }
    } catch (err) {
      setServerError(`Gagal mengambil data server: ${err.message}`);
      console.error("Server fetch error:", err);
    } finally {
      setServerLoading(false);
    }
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    if (quality.serverList.length > 0) {
      const newServer = quality.serverList[0];
      setSelectedServer(newServer);

      // Fetch server data if serverId is available
      if (newServer.serverId) {
        fetchServerData(newServer.serverId, newServer.title, quality.title);
      } else {
        // If no serverId, try using href directly
        if (newServer.href) {
          setStreamingUrl(newServer.href);
          setCurrentlyPlaying(`${quality.title} - ${newServer.title}`);
        }
      }
    } else {
      setSelectedServer(null);
      // Reset to default if no servers in this quality
      setStreamingUrl(episodeDetail.defaultStreamingUrl || "");
      setCurrentlyPlaying("Default Server");
    }
  };

  const handleServerChange = (server, quality) => {
    setSelectedServer(server);

    // Fetch server data if serverId is available
    if (server.serverId) {
      fetchServerData(server.serverId, server.title, quality.title);
    } else {
      // If no serverId, try using href directly
      if (server.href) {
        setStreamingUrl(server.href);
        setCurrentlyPlaying(`${quality.title} - ${server.title}`);
      } else {
        // Reset to default if no href
        setStreamingUrl(episodeDetail.defaultStreamingUrl || "");
        setCurrentlyPlaying("Default Server");
      }
    }
  };

  // Helper function to reload iframe
  const reloadPlayer = () => {
    setStreamingUrl("");
    setTimeout(() => {
      setStreamingUrl(streamingUrl);
    }, 100);
  };

  // Helper function to check if current episode
  const isCurrentEpisode = (episode) => {
    return episode.episodeId === episodeId;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!episodeDetail) return <div className="flex justify-center items-center h-screen">Episode tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-2 sm:px-4 bg-gray-900 text-gray-200 min-h-screen">
      <div className="my-4 flex justify-between items-center">
        <Link to={`/anime/${episodeDetail.animeId}`} className="text-blue-400 hover:text-blue-300">
          &larr; Kembali ke Detail Anime
        </Link>
        <Link to="/history" className="text-blue-400 hover:text-blue-300">
          Riwayat Tontonan
        </Link>
      </div>

      {/* Video Player Section */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3">{episodeDetail.title}</h1>
        <div className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <span className="inline-block bg-blue-500 text-white px-2 py-1 text-xs sm:text-sm rounded-md">{currentlyPlaying}</span>
          </div>
          <button onClick={reloadPlayer} className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-xs sm:text-sm rounded-md">
            Reload Player
          </button>
        </div>
        <div className="w-full">
          {serverLoading ? (
            <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-lg shadow-lg bg-gray-800 flex justify-center items-center">Loading server...</div>
          ) : serverError ? (
            <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-lg shadow-lg bg-gray-800 flex justify-center items-center text-red-500">{serverError}</div>
          ) : streamingUrl ? (
            <iframe
              key={streamingUrl} // Key ensures iframe reloads when URL changes
              src={streamingUrl}
              title={episodeDetail.title}
              allowFullScreen
              className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-lg shadow-lg"
            ></iframe>
          ) : (
            <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-lg shadow-lg bg-gray-800 flex justify-center items-center">No streaming URL available</div>
          )}
        </div>
      </div>

      {/* Quality and Server Selection */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Pilih Kualitas dan Server</h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {episodeDetail.server.qualities.map((quality, qualityIndex) => (
            <div key={`quality-${qualityIndex}-${quality.title}`} className="flex flex-col w-full sm:w-auto">
              <button
                onClick={() => handleQualityChange(quality)}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-lg ${selectedQuality?.title === quality.title ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}
                disabled={serverLoading}
              >
                {quality.title}
              </button>
              {selectedQuality?.title === quality.title && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {quality.serverList.map((server, serverIndex) => (
                    <button
                      key={`server-${serverIndex}-${server.serverId}`}
                      onClick={() => handleServerChange(server, selectedQuality)}
                      className={`px-3 py-1 text-sm rounded-lg ${selectedServer?.serverId === server.serverId ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}
                      disabled={serverLoading}
                    >
                      {server.title}
                      {serverLoading && selectedServer?.serverId === server.serverId && <span className="ml-2">...</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Episode Navigation */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          {episodeDetail.hasPrevEpisode && (
            <Link to={`/watch/${episodeDetail.prevEpisode.episodeId}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center sm:text-left">
              &larr; {episodeDetail.prevEpisode.title}
            </Link>
          )}
          {episodeDetail.hasNextEpisode && (
            <Link to={`/watch/${episodeDetail.nextEpisode.episodeId}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center sm:text-right">
              {episodeDetail.nextEpisode.title} &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Episode List Section - Similar to AnimeDetail.jsx */}
      {animeDetail && animeDetail.episodeList && animeDetail.episodeList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">Daftar Episode</h2>
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {animeDetail.episodeList.map((episode, index) => (
              <Link
                key={episode.episodeId}
                to={`/watch/${episode.episodeId}`}
                className={`block px-4 py-3 hover:bg-gray-700 transition-colors ${isCurrentEpisode(episode) ? "bg-blue-900" : index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} border-b border-gray-700 flex justify-between items-center`}
              >
                <div className={`font-medium ${isCurrentEpisode(episode) ? "text-white" : ""}`}>
                  {animeDetail.title} Episode {episode.title} Subtitle Indonesia
                </div>
                <div className={`${isCurrentEpisode(episode) ? "text-blue-300" : "text-gray-400"}`}>
                  {episode.releasedDate ||
                    new Date(
                      2025,
                      0, // January
                      8 + (Number(episode.title) - 1) * 7 // Starting from Jan 8, 2025, add 7 days per episode
                    ).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchEpisode;
