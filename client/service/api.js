import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export const getHomeAnime = async () => {
  try {
    const response = await axios.get(`${API_BASE}/home`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil data home anime");
  }
};
export const getAnimeDetail = async (animeId) => {
  try {
    const response = await axios.get(`${API_BASE}/anime/${animeId}`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil detail anime");
  }
};
export const getAnimeBatch = async (batchId) => {
  try {
    const response = await axios.get(`${API_BASE}/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil detail batch anime");
    throw error; // Re-throw error agar bisa ditangkap di komponen
  }
};
export const getAnimeEpisode = async (episodeId) => {
  try {
    const response = await axios.get(`${API_BASE}/episode/${episodeId}`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil episode anime");
    throw error; // Re-throw error agar bisa ditangkap di komponen
  }
};
