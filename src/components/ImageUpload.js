// import React and useState
import React, { useState } from "react";

// import axios instance
import api from "../api/axiosInstance";

export default function ImageUpload({ onUpload }) {
  // hold preview image URL
  const [preview, setPreview] = useState(null);

  // handle selecting an image file
  const handleFile = async (e) => {
    // get selected file
    const file = e.target.files[0];

    // store preview URL for UI display
    setPreview(URL.createObjectURL(file));

    // create form data object for file upload
    const formData = new FormData();
    formData.append("image", file);

    // send file to backend upload endpoint
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // pass uploaded image URL back to parent component
    onUpload(res.data.url);
  };

  return (
    <div>
      {/* file input button */}
      <input type="file" onChange={handleFile} />

      {/* show preview if set */}
      {preview && <img src={preview} width="150" alt="Preview" />}
    </div>
  );
}
