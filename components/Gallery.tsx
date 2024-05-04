"use client"

import React from "react"

const Gallery = ({ userImagesGen }: any) => {
  console.log("userImagesGen", userImagesGen)

  return (
    <>
      <h1 className="my-4 mt-12 text-2xl">generated images:</h1>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {userImagesGen.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={image.url}
              className="rounded-lg"
              width="200"
              height="200"
              alt={`Saved image ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default Gallery
