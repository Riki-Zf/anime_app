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
export const getDetailAnime = async () => {
  try {
    const response = await axios.get(`${API_BASE}/anime/:id`);
    return response.data;
  } catch (error) {
    console.error("gagal mengambil detail anime");
  }
};
