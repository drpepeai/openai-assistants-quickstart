"use client";
import React from "react";

import Chat from "../../components/chat";
import FileViewer from "../../components/file-viewer";

const FileSearchPage = () => {
  return (
    <main className={""}>
      <div className={""}>
        <div className={""}>
          <FileViewer />
        </div>
        <div className={""}>
          <div className={""}>
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FileSearchPage;
