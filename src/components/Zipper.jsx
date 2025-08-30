import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function FileZipper() {
  const [files, setFiles] = useState([]);
  const [folderFiles, setFolderFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [progress, setProgress] = useState(0);
  const [zipping, setZipping] = useState(false);

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFoldersChange = (e) => {
    const allFiles = Array.from(e.target.files);
    setFolderFiles(prev => [...prev, ...allFiles]);
    const newFolders = allFiles
      .map(f => f.webkitRelativePath.split("/")[0])
      .filter((name, i, arr) => arr.indexOf(name) === i && !folders.includes(name));
    setFolders(prev => [...prev, ...newFolders]);
  };

  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));
  const removeFolder = (index) => {
    const folderName = folders[index];
    setFolders(prev => prev.filter((_, i) => i !== index));
    setFolderFiles(prev => prev.filter(f => !f.webkitRelativePath.startsWith(folderName + "/")));
  };

  const handleDownloadZip = async () => {
    if (!files.length && !folderFiles.length) return;

    setZipping(true);
    const zip = new JSZip();

    files.forEach(file => zip.file(file.name, file));
    folderFiles.forEach(file => zip.file(file.webkitRelativePath, file));

    const blob = await zip.generateAsync(
      { type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } },
      metadata => setProgress(Math.floor(metadata.percent))
    );

    saveAs(blob, "files.zip");
    setZipping(false);
    setProgress(0);
  };

  const totalSize = [...files, ...folderFiles].reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">File & Folder Zipper</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Files Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <p className="font-semibold text-gray-700 mb-3 text-lg">Files</p>
            <input
              type="file"
              multiple
              onChange={handleFilesChange}
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

          {/* Folders Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <p className="font-semibold text-gray-700 mb-3 text-lg">Folders</p>
            <input
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFoldersChange}
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
        </div>

        {/* Summary & Download */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-700 font-medium">Total files:</p>
            <p className="text-gray-900 font-semibold">{files.length + folderFiles.length}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-gray-700 font-medium">Total size:</p>
            <p className="text-gray-900 font-semibold">{(totalSize / (1024*1024)).toFixed(2)} MB</p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={!(files.length + folderFiles.length) || zipping}
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
      </div>
    </div>
  );
}
