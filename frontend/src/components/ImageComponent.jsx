import React from 'react'

export const ImageComponent = ({multiple, label, value, onFileChangeHandler, imageErrors}) => {

  const handleFileChange = (e) => {
    onFileChangeHandler(e.target.files)
  }
  return (
    <>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <div className="flex justify-center max-w-lg px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative font-medium text-white bg-gray-700 rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-gray-300"
                >
                  <span>{label}</span>
                  <input
                    name="images"
                    value={value}
                    onChange={handleFileChange}
                    type="file"
                    multiple={multiple}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 1MB</p>
            </div>
          </div>
        </div>
      </div>
      {imageErrors.length > 0
        ? imageErrors.map((error) => (
            <span className="block text-xs text-red-500 ">
              {error}
            </span>
          ))
        : ""}
      
    </>
  );
}

