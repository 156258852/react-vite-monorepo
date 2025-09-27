import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './App.css';

// 使用本地worker文件
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

        function onDocumentLoadSuccess({ numPages, ...rest }) {
    console.log('🚀 >>> rest', rest);
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(newPageNumber, 1), numPages);
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <div className="app">
      <h1>PDF 查看器</h1>
      <div className="pdf-wrapper">
        <div
          className="nav-button left"
          onClick={previousPage}
          style={{ display: pageNumber <= 1 ? 'none' : 'flex' }}
        >
          ‹
        </div>

        <div className="pdf-container">
          <Document
            file="/lhy.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            renderMode="canvas"
          >
            <Page pageNumber={pageNumber} width={800} />
          </Document>
        </div>

        <div
          className="nav-button right"
          onClick={nextPage}
          style={{ display: pageNumber >= numPages ? 'none' : 'flex' }}
        >
          ›
        </div>
      </div>

      {numPages > 0 && (
        <div className="page-info">
          第 {pageNumber} 页，共 {numPages} 页
        </div>
      )}
    </div>
  );
}

export default App;
