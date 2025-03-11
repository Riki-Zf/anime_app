require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const WAJIK_API = "https://wajik-anime-api.vercel.app";
app.get("/api/home", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/samehadaku/home`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data home" });
  }
});

app.get("/api/ongoing", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/samehadaku/ongoing`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data anime ongoing" });
  }
});
app.get("/api/anime/:id", async (req, res) => {
  try {
    const animeId = req.params.id; // Mengambil ID dari parameter URL
    const response = await axios.get(`${WAJIK_API}/samehadaku/anime/${animeId}`);

    // Mengirim respons data anime ke client
    res.json(response.data);
  } catch (error) {
    // Menangani error dan memberikan respons yang lebih informatif
    if (error.response) {
      // Jika error berasal dari respons API eksternal
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // Jika tidak ada respons dari server
      res.status(500).json({ error: "Tidak ada respons dari server" });
    } else {
      // Jika terjadi kesalahan lain
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data anime" });
    }
  }
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
