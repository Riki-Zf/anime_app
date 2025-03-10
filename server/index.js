require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const WAJIK_API = "https://wajik-anime-api.vercel.app/";
app.get("/api/home", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/otakudesu/home`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data home" });
  }
});
app.get("/api/rilis", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/otakudesu/schedule`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data jadwal rilis" });
  }
});

app.get("/api/anime", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/otakudesu/anime`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil semua anime" });
  }
});

app.get("/api/genres", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/otakudesu/genres`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data genre" });
  }
});
app.get("/api/ongoing", async (req, res) => {
  try {
    const response = await axios.get(`${WAJIK_API}/otakudesu/ongoing`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data anime ongoing" });
  }
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
