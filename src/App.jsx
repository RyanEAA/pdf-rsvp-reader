import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import PDFViewer from "./components/PDFViewer";
import RSVPDisplay from "./components/RSVPDisplay";
import { extractWordsFromPdf } from "./utils/pdfTextExtractor";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PLAYBACK_MS = 250;

export default function App() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentWord = words[currentWordIndex] ?? null;

  console.log(currentWord);

  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setPdfDoc(null);
    setWords([]);
    setCurrentWordIndex(0);
    setIsPlaying(false);

    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;

    setPdfDoc(pdf);

    const extractedWords = await extractWordsFromPdf(pdf);
    setWords(extractedWords);
  }

  useEffect(() => {
    if (!isPlaying || words.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentWordIndex((index) => {
        if (index >= words.length - 1) {
          setIsPlaying(false);
          return index;
        }

        return index + 1;
      });
    }, PLAYBACK_MS);

    return () => clearInterval(intervalId);
  }, [isPlaying, words.length]);

  return (
    <main className="app">
      <section className="toolbar">
        <input type="file" accept="application/pdf" onChange={handleUpload} />

        <button
          onClick={() => setIsPlaying((value) => !value)}
          disabled={words.length === 0}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setCurrentWordIndex(0);
          }}
          disabled={words.length === 0}
        >
          Reset
        </button>

        <span>
          {words.length > 0
            ? `${currentWordIndex + 1} / ${words.length}`
            : "No PDF loaded"}
        </span>
      </section>

      <RSVPDisplay word={currentWord} />
      

      <PDFViewer pdfDoc={pdfDoc} activeWord={currentWord} />
    </main>
  );
}