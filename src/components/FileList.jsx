import React from "react";

export default function FileList({ files, onFilesChange, removeFile }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
      <p className="font-semibold text-gray-700 mb-3 text-lg">Files</p>
      <input
        type="file"
        multiple
        onChange={onFilesChange}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {files.length > 0 && (
        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto rounded-md border border-gray-200">
          {files.slice(0, 10).map((f, i) => (
            <li key={i} className="flex justify-between items-center px-4 py-2">
              <span className="text-gray-700 text-sm">{f.name} ({(f.size/1024).toFixed(1)} KB)</span>
              <button
                className="text-red-500 text-sm hover:text-red-700 transition"
                onClick={() => removeFile(i)}
              >
                Remove
              </button>
            </li>
          ))}
          {files.length > 10 && <li className="px-4 py-2 text-gray-500 text-sm">...and {files.length - 10} more</li>}
        </ul>
      )}
    </div>
  );
}
