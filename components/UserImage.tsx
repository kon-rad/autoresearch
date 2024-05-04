import React, { useState } from "react"
import Webcam from "react-webcam"

const UserImage = ({ setPreviewSource }: any) => {
  const webcamRef = React.useRef<Webcam>(null)
  const [screenshot, setScreenshot] = useState<string | null>(null)

  const handleTakeScreenshot = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    setScreenshot(imageSrc || null)
    setPreviewSource(imageSrc)
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-700">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png" // Set format to PNG
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-0 w-full bg-black bg-opacity-60 p-2 text-sm text-white">
        <button
          onClick={handleTakeScreenshot}
          className="ml-8 mt-1 rounded bg-gray-600 p-1 text-white"
        >
          Take Screenshot
        </button>
        {screenshot && (
          <div className="mt-4">
            <img src={screenshot} alt="Screenshot" />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserImage
