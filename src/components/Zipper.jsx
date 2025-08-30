import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import FileList from "./FileList";
import FolderList from "./FolderList";
import SummaryDownload from "./SummaryDownload";

export default function Zipper() {
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
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center">Easy Zipper</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FileList files={files} onFilesChange={handleFilesChange} removeFile={removeFile} />
          <FolderList folders={folders} onFoldersChange={handleFoldersChange} removeFolder={removeFolder} />
        </div>

        <SummaryDownload
          totalFiles={files.length + folderFiles.length}
          totalSize={totalSize}
          zipping={zipping}
          progress={progress}
          onDownload={handleDownloadZip}
        />
      </div>
    </div>
  );
}
