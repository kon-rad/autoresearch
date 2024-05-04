"use client"

import React from "react"

const Gallery = ({ userGenVideos }: any) => {
  console.log("userGenVideos", userGenVideos)

  return (
    <>
      <h1 className="text-2xl my-4">generated videos:</h1>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {userGenVideos.map((video, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg">
            <video
              src={video.url}
              className="rounded-lg"
              width="200"
              height="200"
              controls
              alt={`Saved video ${index + 1}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </>
  )
}

export default Gallery
