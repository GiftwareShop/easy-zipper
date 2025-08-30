import React from "react";

export default function SummaryDownload({ totalFiles, totalSize, zipping, progress, onDownload }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="flex justify-between mb-2">
        <p className="text-gray-700 font-medium">Total files:</p>
        <p className="text-gray-900 font-semibold">{totalFiles}</p>
      </div>
      <div className="flex justify-between mb-4">
        <p className="text-gray-700 font-medium">Total size:</p>
        <p className="text-gray-900 font-semibold">{(totalSize / (1024*1024)).toFixed(2)} MB</p>
      </div>

      <button
        onClick={onDownload}
        disabled={!totalFiles || zipping}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {zipping ? `Zipping... ${progress}%` : "Download ZIP"}
      </button>

      {zipping && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
