// src/components/CreatePost.js

import React, { useState } from "react";
import { createPost } from "./data-server-handler.js"; // Mengimpor createPost dari api.js

const CobaForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Both title and content are required!");
      return;
    }

    const newPost = {
      title: title,
      content: content,
    };

    try {
      setLoading(true); // Menampilkan loading saat request sedang diproses
      const createdPost = await createPost(newPost); // Memanggil createPost untuk mengirim data ke server
      console.log("Post created:", createdPost); // Menampilkan post yang berhasil dibuat
      setTitle("");
      setContent("");
      setError("");
    } catch (err) {
      setError("Failed to create post. Please try again."); // Menangani error jika gagal
      console.error("Error creating post:", err);
    } finally {
      setLoading(false); // Menyembunyikan loading setelah proses selesai
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Menyimpan title yang diinput
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)} // Menyimpan content yang diinput
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CobaForm;
