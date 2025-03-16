import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnimeSchedule } from "../../service/api";

const AnimeSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await getAnimeSchedule();

        if (response && response.data) {
          setSchedule(response.data.days);
        } else {
          throw new Error("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil jadwal anime");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!schedule) return <div className="flex justify-center items-center h-screen">Jadwal anime tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-xl font-bold mb-4 pb-2 border-b">Jadwal Anime</h1>

      {schedule.map((day, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{day.day}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {day.animeList.map((anime, idx) => (
              <Link key={idx} to={`/anime/${anime.animeId}`} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:bg-gray-700 transition-colors">
                <div className="flex items-center p-4">
                  <img src={anime.poster} alt={anime.title} className="w-16 h-24 object-cover rounded-lg" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{anime.title}</h3>
                    <p className="text-sm text-gray-400">{anime.type}</p>
                    <p className="text-sm text-gray-400">Skor: {anime.score}</p>
                    <p className="text-sm text-gray-400">Genre: {anime.genres}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeSchedule;
