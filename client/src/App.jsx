import React from "react";
import Navbar from "./components/Navbar";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AnimeDetail from "./pages/AnimeDetail";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import AnimeBatchDetail from "./pages/AnimeBatchDetail";
import WatchEpisode from "./pages/WatchEpisode";

import AnimeRecent from "./pages/AnimeRecent";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <>
      <Navbar />

      <div className="w-4/5 mx-auto">
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:animeId" element={<AnimeDetail />} />
          <Route path="/batch/:batchId" element={<AnimeBatchDetail />} />
          <Route path="/watch/:episodeId" element={<WatchEpisode />} />
          <Route path="/on-going" element={<AnimeRecent />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
