import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnimeBatch } from "../../service/api";

const AnimeBatchDetail = () => {
  const { batchId } = useParams();
  const [batchDetail, setBatchDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchDetail = async () => {
      try {
        setLoading(true);
        const response = await getAnimeBatch(batchId);
        console.log("Raw API response:", response); // Debug respons API

        if (response && response.data) {
          setBatchDetail(response.data); // Menggunakan response.data
        } else {
          throw new Error("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil detail batch anime");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchDetail();
    }
  }, [batchId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!batchDetail) return <div className="flex justify-center items-center h-screen">Batch anime tidak ditemukan</div>;

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
            <img src={batchDetail.poster} alt={batchDetail.title} className="w-full object-cover" />
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-2">
          {/* Anime Info Table */}
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="px-4 py-2 w-1/3 font-medium">Judul</td>
                  <td className="px-4 py-2">: {batchDetail.title}</td>
                </tr>
                {batchDetail.japanese && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Japanese</td>
                    <td className="px-4 py-2">: {batchDetail.japanese}</td>
                  </tr>
                )}
                {batchDetail.score && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Skor</td>
                    <td className="px-4 py-2">: {batchDetail.score}</td>
                  </tr>
                )}
                {batchDetail.producers && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Produser</td>
                    <td className="px-4 py-2">: {batchDetail.producers}</td>
                  </tr>
                )}
                {batchDetail.type && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Tipe</td>
                    <td className="px-4 py-2">: {batchDetail.type}</td>
                  </tr>
                )}
                {batchDetail.status && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Status</td>
                    <td className="px-4 py-2">: {batchDetail.status}</td>
                  </tr>
                )}
                {batchDetail.episodes && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Total Episode</td>
                    <td className="px-4 py-2">: {batchDetail.episodes}</td>
                  </tr>
                )}
                {batchDetail.duration && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Durasi</td>
                    <td className="px-4 py-2">: {batchDetail.duration}</td>
                  </tr>
                )}
                {batchDetail.aired && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Tanggal Rilis</td>
                    <td className="px-4 py-2">: {batchDetail.aired.split(" to ")[0]}</td>
                  </tr>
                )}
                {batchDetail.studios && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Studio</td>
                    <td className="px-4 py-2">: {batchDetail.studios}</td>
                  </tr>
                )}
                {batchDetail.genreList && batchDetail.genreList.length > 0 && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Genre</td>
                    <td className="px-4 py-2">: {batchDetail.genreList.map((genre) => genre.title).join(", ")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Synopsis */}
          {batchDetail.synopsis && batchDetail.synopsis.paragraphs && batchDetail.synopsis.paragraphs.length > 0 && (
            <div className="mt-6 bg-gray-800 rounded-lg shadow-md p-4">
              {batchDetail.synopsis.paragraphs.map((paragraph, index) => (
                <p key={index} className={index < batchDetail.synopsis.paragraphs.length - 1 ? "mb-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Download Section */}
      {batchDetail.downloadUrl && batchDetail.downloadUrl.formats && batchDetail.downloadUrl.formats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700">Download Batch</h2>
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-4">
            {/* Group downloads by format and quality */}
            {batchDetail.downloadUrl.formats.map((format) => (
              <div key={format.title} className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{format.title}</h3>
                {format.qualities.map((quality) => (
                  <div key={quality.title} className="mb-4">
                    <h4 className="text-md font-medium mb-2">{quality.title}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {quality.urls.map((url, index) => (
                        <a key={index} href={url.url} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-center text-sm transition-colors" target="_blank" rel="noopener noreferrer">
                          {url.title || "Download"}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeBatchDetail;
