import React from "react";

export default function FolderList({ folders, onFoldersChange, removeFolder }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
      <p className="font-semibold text-gray-700 mb-3 text-lg">Folders</p>
      <input
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        onChange={onFoldersChange}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {folders.length > 0 && (
        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto rounded-md border border-gray-200">
          {folders.slice(0, 10).map((folder, i) => (
            <li key={i} className="flex justify-between items-center px-4 py-2">
              <span className="text-gray-700 text-sm">{folder}</span>
              <button
                className="text-red-500 text-sm hover:text-red-700 transition"
                onClick={() => removeFolder(i)}
              >
                Remove
              </button>
            </li>
          ))}
          {folders.length > 10 && <li className="px-4 py-2 text-gray-500 text-sm">...and {folders.length - 10} more</li>}
        </ul>
      )}
    </div>
  );
}
