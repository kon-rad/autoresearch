"use client"

import React from "react"

const Gallery = () => {
  const [savedImages, setSavedImages] = React.useState<string[]>([])

  React.useEffect(() => {
    const images = JSON.parse(localStorage.getItem("savedImages") || "[]")
    setSavedImages(images)
  }, [])

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {" "}
      {/* Updated classes here for flex layout and padding */}
      {savedImages.map((image, index) => (
        <div key={index} className="overflow-hidden rounded-lg shadow-lg">
          {" "}
          {/* Updated classes here for shadow and rounded corners */}
          <img
            src={`data:image/jpeg;base64,${image}`}
            className="rounded-lg"
            width="200"
            height="200"
            alt={`Saved image ${index + 1}`}
          />
        </div>
      ))}
    </div>
  )
}

export default Gallery
