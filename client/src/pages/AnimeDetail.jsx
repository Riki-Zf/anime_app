import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeDetail } from "../../service/api";

const AnimeDetail = () => {
  const { animeId } = useParams();
  const [animeDetail, setAnimeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        const response = await getAnimeDetail(animeId);

        if (response && response.data) {
          setAnimeDetail(response.data);
        } else {
          throw new Error("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil detail anime");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchAnimeDetail();
    }
  }, [animeId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!animeDetail) return <div className="flex justify-center items-center h-screen">Anime tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-200 min-h-screen">
      <div className="mb-4">
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          &larr; Kembali ke Beranda
        </Link>
      </div>

      {/* Header Section with Poster and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Poster Column */}
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={animeDetail.poster} alt={animeDetail.title} className="w-full object-cover" />
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-2">
          {/* Anime Info Table - Styled like the reference */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="px-4 py-2 w-1/3 font-medium">Judul</td>
                  <td className="px-4 py-2">: {animeDetail.title}</td>
                </tr>
                {animeDetail.japanese && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Japanese</td>
                    <td className="px-4 py-2">: {animeDetail.japanese}</td>
                  </tr>
                )}
                {animeDetail.score && animeDetail.score.value && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Skor</td>
                    <td className="px-4 py-2">: {animeDetail.score.value}</td>
                  </tr>
                )}
                {animeDetail.producers && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Produser</td>
                    <td className="px-4 py-2">: {animeDetail.producers}</td>
                  </tr>
                )}
                {animeDetail.type && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Tipe</td>
                    <td className="px-4 py-2">: {animeDetail.type}</td>
                  </tr>
                )}
                {animeDetail.status && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Status</td>
                    <td className="px-4 py-2">: {animeDetail.status}</td>
                  </tr>
                )}
                {animeDetail.episodes && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Total Episode</td>
                    <td className="px-4 py-2">: {animeDetail.episodes}</td>
                  </tr>
                )}
                {animeDetail.duration && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Durasi</td>
                    <td className="px-4 py-2">: {animeDetail.duration}</td>
                  </tr>
                )}
                {animeDetail.aired && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Tanggal Rilis</td>
                    <td className="px-4 py-2">: {animeDetail.aired.split(" to ")[0]}</td>
                  </tr>
                )}
                {animeDetail.studios && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Studio</td>
                    <td className="px-4 py-2">: {animeDetail.studios}</td>
                  </tr>
                )}
                {animeDetail.genreList && animeDetail.genreList.length > 0 && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Genre</td>
                    <td className="px-4 py-2">: {animeDetail.genreList.map((genre) => genre.title).join(", ")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Synopsis */}
          {animeDetail.synopsis && animeDetail.synopsis.paragraphs && animeDetail.synopsis.paragraphs.length > 0 && (
            <div className="mt-6 bg-gray-800 rounded-lg shadow-md p-4">
              {animeDetail.synopsis.paragraphs.map((paragraph, index) => (
                <p key={index} className={index < animeDetail.synopsis.paragraphs.length - 1 ? "mb-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Episode List Section - Styled like the reference */}
      {animeDetail.episodeList && animeDetail.episodeList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">Daftar Episode</h2>
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {animeDetail.episodeList.map((episode, index) => (
              <Link
                key={episode.episodeId}
                to={`/watch/${episode.episodeId}`}
                className={`block px-4 py-3 hover:bg-gray-700 transition-colors ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} border-b border-gray-700 flex justify-between items-center`}
              >
                <div className="font-medium">
                  {animeDetail.title} Episode {episode.title} Subtitle Indonesia
                </div>
                <div className="text-gray-400">
                  {/* Assuming a date format or using a placeholder */}
                  {episode.releasedDate ||
                    // Fake dates based on episode number like in reference image
                    new Date(
                      2025,
                      0, // January
                      8 + (episode.title - 1) * 7 // Starting from Jan 8, 2025, add 7 days per episode
                    ).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Batch List Section */}
      {animeDetail.batchList && animeDetail.batchList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">Batch Download</h2>
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {animeDetail.batchList.map((batch, index) => (
              <Link key={batch.batchId} to={batch.href} className={`block px-4 py-3 hover:bg-gray-700 transition-colors ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} border-b border-gray-700`}>
                <div className="font-medium">
                  {animeDetail.title} Batch {batch.quality || "Complete"} Subtitle Indonesia
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
