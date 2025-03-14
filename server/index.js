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
app.get("/api/anime", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/samehadaku/anime`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data anime" });
  }
});

app.get("/api/recent", async (req, res) => {
  try {
    const page = req.query.page || 1; // Ambil parameter `page` dari query, default ke 1 jika tidak ada
    const response = await axios.get(`${WAJIK_API}/samehadaku/recent?page=${page}`); // Teruskan parameter `page` ke API eksternal
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data anime ongoing" });
  }
});
app.get("/api/anime/:id", async (req, res) => {
  try {
    const animeId = req.params.id;
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
app.get("/api/batch/:id", async (req, res) => {
  try {
    const batchId = req.params.id;
    const response = await axios.get(`${WAJIK_API}/samehadaku/batch/${batchId}`);

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
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil batch anime" });
    }
  }
});
app.get("/api/episode/:id", async (req, res) => {
  try {
    const episodeId = req.params.id;
    const response = await axios.get(`${WAJIK_API}/samehadaku/episode/${episodeId}`);

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
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil batch anime" });
    }
  }
});
app.get("/api/server/:id", async (req, res) => {
  try {
    const serverId = req.params.id;
    const response = await axios.get(`${WAJIK_API}/samehadaku/server/${serverId}`);

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
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil server anime" });
    }
  }
});
// Endpoint search pada index.js
app.get("/api/search", async (req, res) => {
  try {
    const { q, page = 1 } = req.query; // Ambil parameter `q` dan `page` dari query

    // Validasi parameter `q` (wajib ada)
    if (!q) {
      return res.status(400).json({ error: "Parameter 'q' (query) diperlukan" });
    }

    console.log(`Mencari anime dengan query: ${q}, halaman: ${page}`);

    // Lakukan permintaan ke API eksternal dengan parameter `q` dan `page`
    const response = await axios.get(`${WAJIK_API}/samehadaku/search`, {
      params: {
        q, // Query pencarian
        page, // Halaman (default: 1)
      },
    });

    // Log response untuk debugging
    console.log(`Response dari API eksternal: Status ${response.status}`);

    // Kirim respons data pencarian ke client
    res.json(response.data);
  } catch (error) {
    console.error("Error pada endpoint search:", error.message);

    // Menangani error dan memberikan respons yang lebih informatif
    if (error.response) {
      // Jika error berasal dari respons API eksternal
      console.error(`API eksternal mengembalikan status: ${error.response.status}`);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // Jika tidak ada respons dari server
      console.error("Tidak ada respons dari API eksternal");
      res.status(500).json({ error: "Tidak ada respons dari server" });
    } else {
      // Jika terjadi kesalahan lain
      console.error(`Error lainnya: ${error.message}`);
      res.status(500).json({ error: "Terjadi kesalahan saat melakukan pencarian anime" });
    }
  }
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
