import React, { useEffect, useState } from "react"

const SwappedImagesDisplay = () => {
  const [swappedImages, setSwappedImages] = useState<string[]>([])

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("swappedImages") || "[]")
    setSwappedImages(images)
  }, [])

  return (
    <div className="flex flex-wrap justify-center">
      {swappedImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt="Swapped Image"
          className="m-2 rounded shadow-lg"
          width="200"
        />
      ))}
    </div>
  )
}

export default SwappedImagesDisplay
