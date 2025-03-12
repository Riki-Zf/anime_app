import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeEpisode } from "../../service/api";

const WatchEpisode = () => {
  const { episodeId } = useParams();
  const [episodeDetail, setEpisodeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodeDetail = async () => {
      try {
        setLoading(true);
        const response = await getAnimeEpisode(episodeId);

        if (response && response.data) {
          setEpisodeDetail(response.data);
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!episodeDetail) return <div className="flex justify-center items-center h-screen">Episode tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-200 min-h-screen">
      <div className="mb-4">
        <Link to={`/anime/${episodeDetail.animeId}`} className="text-blue-400 hover:text-blue-300">
          &larr; Kembali ke Detail Anime
        </Link>
      </div>

      {/* Video Player Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{episodeDetail.title}</h1>
        <div className="aspect-w-16 aspect-h-9">
          <iframe src={episodeDetail.defaultStreamingUrl} title={episodeDetail.title} allowFullScreen className="w-full h-screen md:h-[80vh] rounded-lg shadow-lg"></iframe>
        </div>
      </div>

      {/* Episode Navigation */}
      <div className="mb-8">
        <div className="flex justify-between">
          {episodeDetail.hasPrevEpisode && (
            <Link to={`/watch/${episodeDetail.prevEpisode.episodeId}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              &larr; {episodeDetail.prevEpisode.title}
            </Link>
          )}
          {episodeDetail.hasNextEpisode && (
            <Link to={`/watch/${episodeDetail.nextEpisode.episodeId}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              {episodeDetail.nextEpisode.title} &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Synopsis */}
      {episodeDetail.synopsis && episodeDetail.synopsis.paragraphs && episodeDetail.synopsis.paragraphs.length > 0 && (
        <div className="mb-8 bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
          {episodeDetail.synopsis.paragraphs.map((paragraph, index) => (
            <p key={index} className={index < episodeDetail.synopsis.paragraphs.length - 1 ? "mb-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Recommended Episodes */}
      {episodeDetail.recommendedEpisodeList && episodeDetail.recommendedEpisodeList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Episode Lainnya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodeDetail.recommendedEpisodeList.map((episode) => (
              <Link key={episode.episodeId} to={`/watch/${episode.episodeId}`} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:bg-gray-700 transition-colors">
                <img src={episode.poster} alt={episode.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium">{episode.title}</h3>
                  <p className="text-sm text-gray-400">{episode.releaseDate}</p>
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
