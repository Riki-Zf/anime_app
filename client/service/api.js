import axios from "axios";

const API_BASE = window.location.hostname === "localhost" ? "http://localhost:3000/api" : "https://anime-app-be.vercel.app/api";

export const getHomeAnime = async () => {
  try {
    const response = await axios.get(`${API_BASE}/home`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil data home anime");
  }
};
export const getAnime = async () => {
  try {
    const response = await axios.get(`${API_BASE}/anime`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil data anime");
  }
};
export const getRecentAnime = async (page = 1) => {
  try {
    const response = await axios.get(`${API_BASE}/recent?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recent anime data");
    throw error; // Re-throw the error for handling in the component
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
export const getAnimeServer = async (serverId) => {
  try {
    const response = await axios.get(`${API_BASE}/server/${serverId}`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil server anime");
    throw error; // Re-throw error agar bisa ditangkap di komponen
  }
};
export const getAnimeSearch = async (query, page = 1) => {
  try {
    // Validasi parameter `query` (wajib ada)
    if (!query) {
      throw new Error("Parameter 'query' diperlukan untuk pencarian anime");
    }

    console.log(`Mengirim request ke API dengan query: ${query}, page: ${page}`);

    // Lakukan permintaan ke API dengan parameter `q` dan `page`
    const response = await axios.get(`${API_BASE}/search`, {
      params: {
        q: query, // Query pencarian
        page, // Halaman (default: 1)
      },
    });

    console.log("Response dari API search:", response.status);

    // Mengembalikan data hasil pencarian
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data pencarian anime:", error.message);
    throw error; // Re-throw error agar bisa ditangkap di komponen
  }
};
