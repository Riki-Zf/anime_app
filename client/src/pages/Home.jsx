import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomeAnime } from "../../service/api";

const Home = () => {
  const [recentAnime, setRecentAnime] = useState([]);
  const [batchAnime, setBatchAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getHomeAnime();

        // Sesuaikan dengan struktur API terbaru
        if (response && response.data) {
          if (response.data.recent && response.data.recent.animeList) {
            setRecentAnime(response.data.recent.animeList); //  recent
          }

          if (response.data.batch && response.data.batch.batchList) {
            setBatchAnime(response.data.batch.batchList); //  batch
          }
        } else {
          throw new Error("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data anime");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-2">
      {/* Recent Anime Section */}
      <section className="mb-8">
        <h1 className="text-xl font-bold mb-4 pb-2 border-b">Anime Terbaru</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
          {recentAnime.map((anime) => (
            <Link key={anime.animeId} to={`/anime/${anime.animeId}`} className="relative border rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer">
              {/* Gambar Anime */}
              <img src={anime.poster} alt={anime.title} className="w-full h-[160px] object-cover" />

              {/* Label Episode */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">📺 {anime.episodes}</div>

              {/* Tanggal Rilis */}
              <div className="absolute top-6 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">{anime.releasedOn}</div>

              {/* Overlay untuk Judul Anime */}
              <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white text-xs text-center p-1">{anime.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Batch Anime Section */}
      <section>
        <h1 className="text-xl font-bold mb-4 pb-2 border-b">Batch Anime</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
          {batchAnime.map((anime) => (
            <Link key={anime.batchId} to={`/batch/${anime.batchId}`} className="relative border rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer">
              {/* Gambar Anime */}
              <img src={anime.poster} alt={anime.title} className="w-full h-[160px] object-cover" />

              {/* Label Episode */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">📺 {anime.episodes}</div>

              {/* Tanggal Rilis */}
              <div className="absolute top-6 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">{anime.releasedOn}</div>

              {/* Overlay untuk Judul Anime */}
              <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white text-xs text-center p-1">{anime.title}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
