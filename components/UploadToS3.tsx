"use client"

import { useState, useCallback, ChangeEvent, useMemo } from "react"
import { useS3Upload } from "next-s3-upload"
// import { updateSite } from "@/lib/database/site"
// import { toast } from "sonner"
import LoadingDots from "@/components/icons/loading-dots"

const UploadToS3 = ({ siteId, defaultValue, name }: any) => {
  const [dragActive, setDragActive] = useState(false)

  const [data, setData] = useState({
    [name]: defaultValue,
  })
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  let { uploadToS3, files } = useS3Upload()

  const [saving, setSaving] = useState(false)

  const saveDisabled = useMemo(() => {
    return !data.image || saving
  }, [data.image, saving])

  let handleUpload = async () => {
    try {
      if (!file) {
        toast.error("Select a file first")
      }
      const { url } = await uploadToS3(file)
      console.log("s3 url: ", url)
      setUrl(url)
      // const res = await updateSite({ image: url }, siteId)

      console.log("uploading to s3 filename: ", file)
      console.log("update db res: ", res)
      toast.success(`Successfully updated main image!`)
    } catch (error) {
      console.error("Error uploading files:", error)
    }
  }

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0]
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)")
        } else {
          setFile(file)
          const reader = new FileReader()

          reader.onload = (e) => {
            setData((prev) => ({
              ...prev,
              [name]: e.target?.result as string,
            }))
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [setData]
  )

  const renderImage = () => {
    if (url) {
      return (
        <img
          src={url}
          alt="Preview"
          className="h-full w-full max-w-[400px] rounded-md rounded-xl object-cover"
        />
      )
    } else if (defaultValue) {
      return (
        <img
          src={defaultValue}
          alt="Preview"
          className="h-full w-full max-w-[400px] rounded-md rounded-xl object-cover"
        />
      )
    } else {
      return (
        <div className="m-1 flex h-[400px] w-[400px] items-center justify-center">
          <svg
            className={`${"scale-110"} h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m16 16-4-4-4 4"></path>
          </svg>
        </div>
      )
    }
  }

  return (
    <div className="font-white max-w-[600px]  text-white">
      <h2 className="mb-4 text-2xl">Main Image</h2>
      <label
        htmlFor="image-upload"
        className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
      >
        {/* {renderImage()} */}

        <div
          className="absolute z-[5] h-full w-full rounded-md"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(true)
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            const file = e.dataTransfer.files && e.dataTransfer.files[0]
            if (file) {
              if (file.size / 1024 / 1024 > 50) {
                toast.error("File size too big (max 50MB)")
              } else {
                setFile(file)
                const reader = new FileReader()
                reader.onload = (e) => {
                  setData((prev) => ({
                    ...prev,
                    image: e.target?.result as string,
                  }))
                }
                reader.readAsDataURL(file)
              }
            }
          }}
        />
        <div
          className={`${
            dragActive ? "border-2 border-black" : ""
          } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
            data[name]
              ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
              : "bg-white opacity-100 hover:bg-gray-50"
          }`}
        >
          <svg
            className={`${
              dragActive ? "scale-110" : "scale-100"
            } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m16 16-4-4-4 4"></path>
          </svg>
          <p className="mt-2 text-center text-sm text-gray-500">
            Drag and drop or click to upload.
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Max file size: 50MB
          </p>
          <span className="sr-only">Photo upload</span>
        </div>
        {data[name] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data[name] as string}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        )}
      </label>

      <input
        type="file"
        className="sr-only"
        id="image-upload"
        name="image"
        accept="image/*"
        onChange={onChangePicture}
      />
      <div className="pt-8">
        {files.map((file, index) => (
          <div key={index}>
            File #{index} progress: {file.progress}%
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          disabled={saveDisabled}
          className={`${
            saveDisabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-black bg-black text-white hover:bg-white hover:text-black"
          } bg-surface-mixed-200 flex h-10 items-center justify-center rounded-md border px-4 text-sm transition-all focus:outline-none`}
          onClick={handleUpload}
        >
          {saving ? (
            <LoadingDots color="#808080" />
          ) : (
            <p className="text-sm">Confirm upload</p>
          )}
        </button>
      </div>
    </div>
  )
}

export default UploadToS3
