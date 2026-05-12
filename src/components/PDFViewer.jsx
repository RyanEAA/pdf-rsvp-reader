import { useEffect, useRef, useState } from "react";

const SCALE = 1.5;

function PDFPage({ pdfDoc, pageNumber, activeWord }) {
  const canvasRef = useRef(null);

  const [pageSize, setPageSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    async function renderPage() {
      const page = await pdfDoc.getPage(pageNumber);

      const viewport = page.getViewport({
        scale: SCALE,
      });

      setPageSize({
        width: viewport.width,
        height: viewport.height,
      });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    }

    renderPage();
  }, [pdfDoc, pageNumber]);

  const showHighlight =
    activeWord && activeWord.page === pageNumber;

  return (
    <div
      className="pdf-page"
      style={{
        width: `${pageSize.width}px`,
        height: `${pageSize.height}px`,
      }}
    >
      <canvas ref={canvasRef} />

      {showHighlight && (
        <div
          className="word-highlight"
          style={{
            left: `${activeWord.x}px`,
            top: `${activeWord.y}px`,
            width: `${activeWord.width}px`,
            height: `${activeWord.height}px`,
          }}
        />
      )}
    </div>
  );
}

export default function PDFViewer({
  pdfDoc,
  activeWord,
}) {
  if (!pdfDoc) {
    return (
      <div className="pdf-empty">
        Upload a PDF
      </div>
    );
  }

  const pages = Array.from(
    { length: pdfDoc.numPages },
    (_, i) => i + 1
  );

  return (
    <section className="pdf-viewer">
      {pages.map((pageNumber) => (
        <PDFPage
          key={pageNumber}
          pdfDoc={pdfDoc}
          pageNumber={pageNumber}
          activeWord={activeWord}
        />
      ))}
    </section>
  );
}