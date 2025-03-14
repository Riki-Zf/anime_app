import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeEpisode, getAnimeServer } from "../../service/api";

const WatchEpisode = () => {
  const { episodeId } = useParams();
  const [episodeDetail, setEpisodeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 20;

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

  // Pagination logic
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = episodeDetail?.recommendedEpisodeList?.slice(indexOfFirstEpisode, indexOfLastEpisode) || [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!episodeDetail) return <div className="flex justify-center items-center h-screen">Episode tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-2 sm:px-4 bg-gray-900 text-gray-200 min-h-screen">
      <div className="my-4">
        <Link to={`/anime/${episodeDetail.animeId}`} className="text-blue-400 hover:text-blue-300">
          &larr; Kembali ke Detail Anime
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

      {/* Synopsis */}
      {episodeDetail.synopsis && episodeDetail.synopsis.paragraphs && episodeDetail.synopsis.paragraphs.length > 0 && (
        <div className="mb-6 bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-bold mb-3">Sinopsis</h2>
          {episodeDetail.synopsis.paragraphs.map((paragraph, index) => (
            <p key={`synopsis-${index}`} className={index < episodeDetail.synopsis.paragraphs.length - 1 ? "mb-3" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Recommended Episodes with Pagination */}
      {episodeDetail.recommendedEpisodeList && episodeDetail.recommendedEpisodeList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3">Episode Lainnya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {currentEpisodes.map((episode, index) => (
              <Link key={`recommended-${index}-${episode.episodeId}`} to={`/watch/${episode.episodeId}`} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:bg-gray-700 transition-colors">
                <img src={episode.poster} alt={episode.title} className="w-full h-36 sm:h-48 object-cover" />
                <div className="p-3">
                  <h3 className="font-medium text-sm sm:text-base">{episode.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{episode.releaseDate}</p>
                </div>
              </Link>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(episodeDetail.recommendedEpisodeList.length / episodesPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchEpisode;
