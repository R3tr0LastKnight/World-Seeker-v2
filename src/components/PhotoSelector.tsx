"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const PhotoSelector = ({ photos, onChange }: Props) => {
  const [photoLink, setPhotoLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const addPhotoByLink = (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (!photoLink.trim()) return;
    onChange([...photos, photoLink]);
    setPhotoLink("");
  };

  const uploadPhoto = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (data.secure_url) uploaded.push(data.secure_url);
    }

    setUploading(false);
    onChange([...photos, ...uploaded]);
    // reset input so same file can be re-selected
    ev.target.value = "";
  };

  const removePhoto = (ev: React.MouseEvent, photo: string) => {
    ev.preventDefault();
    onChange(photos.filter((p) => p !== photo));
  };

  const selectAsMain = (ev: React.MouseEvent, photo: string) => {
    ev.preventDefault();
    onChange([photo, ...photos.filter((p) => p !== photo)]);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          placeholder="Paste image URL..."
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
        />
        <button
          className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 transition-all"
          onClick={addPhotoByLink}
        >
          Add photo
        </button>
      </div>

      {uploading && (
        <p className="text-sm text-gray-500 mb-2 animate-pulse">
          Uploading to Cloudinary...
        </p>
      )}

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {photos.map((link) => (
          <div className="h-32 flex relative" key={link}>
            <Image
              className="rounded w-full object-cover"
              src={link}
              alt="listing photo"
              fill
              // needed for external Cloudinary URLs
              unoptimized={link.startsWith("blob:")}
            />
            <button
              onClick={(ev) => removePhoto(ev, link)}
              className="absolute bottom-1 right-1 text-white bg-black p-1.5 opacity-60 rounded hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={(ev) => selectAsMain(ev, link)}
              className="absolute bottom-1 left-1 text-white bg-black p-1.5 opacity-60 rounded hover:opacity-100"
            >
              {link === photos[0] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}

        <label className="h-32 flex items-center cursor-pointer justify-center gap-1 border border-dashed border-gray-400 rounded text-gray-500 hover:bg-gray-50 transition-all">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
            disabled={uploading}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          {uploading ? "Uploading..." : "Upload"}
        </label>
      </div>
    </div>
  );
};

export default PhotoSelector;
