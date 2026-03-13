import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import cvPdfUrl from "../assets/Toby_Jennings_CV.pdf?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const MIN_RENDER_WIDTH = 420;
const PAGE_SIDE_PADDING = 40;

export default function CV() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [renderWidth, setRenderWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const viewportRef = useRef(null);
  const canvasesRef = useRef([]);

  useEffect(() => {
    const loadingTask = getDocument(cvPdfUrl);
    let isCancelled = false;

    async function loadPdf() {
      try {
        const loadedPdf = await loadingTask.promise;
        if (isCancelled) {
          return;
        }
        setPdfDoc(loadedPdf);
        setPageCount(loadedPdf.numPages);
      } catch (loadError) {
        if (isCancelled) {
          return;
        }
        setError(`Failed to load CV: ${loadError.message}`);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      loadingTask.destroy();
    };
  }, []);

  useEffect(() => {
    const host = viewportRef.current;
    if (!host) {
      return undefined;
    }

    const updateWidth = () => {
      setRenderWidth(host.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pdfDoc || renderWidth === 0) {
      return undefined;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError("");

    async function renderPages() {
      try {
        const availableWidth = Math.max(MIN_RENDER_WIDTH, renderWidth - PAGE_SIDE_PADDING);

        for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
          const page = await pdfDoc.getPage(pageNumber);
          if (isCancelled) {
            return;
          }

          const baseViewport = page.getViewport({ scale: 1 });
          const scale = availableWidth / baseViewport.width;
          const viewport = page.getViewport({ scale });
          const canvas = canvasesRef.current[pageNumber - 1];
          if (!canvas) {
            continue;
          }

          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Canvas context is unavailable.");
          }
          const dpr = window.devicePixelRatio || 1;
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          context.setTransform(dpr, 0, 0, dpr, 0, 0);

          await page.render({ canvasContext: context, viewport }).promise;
          if (isCancelled) {
            return;
          }
        }

        if (!isCancelled) {
          setIsLoading(false);
        }
      } catch (renderError) {
        if (isCancelled) {
          return;
        }
        setError(`Failed to render CV: ${renderError.message}`);
        setIsLoading(false);
      }
    }

    renderPages();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, renderWidth]);

  const pageIndexes = useMemo(
    () => Array.from({ length: pageCount }, (_, index) => index),
    [pageCount]
  );

  return (
    <div className="page cv-page">
      <div className="cv-toolbar">
        <p className="cv-toolbar-title">Toby_Jennings_CV.pdf</p>
        <a className="cv-download-button" href={cvPdfUrl} download="Toby_Jennings_CV.pdf">
          <Icon icon="mdi:tray-download" width={15}/> download
        </a>
      </div>

      <div className="cv-viewport" ref={viewportRef}>
        {error && <p classname="cv-error">{error}</p>}
        {!error && isLoading && <p className="cv-loading">Rendering cv...</p>}

        {!error &&
          pageIndexes.map((pageIndex) => (
            <div className="cv-page-frame" key={pageIndex}>
              <canvas
                className="cv-canvas"
                ref={(element) => {
                  canvasesRef.current[pageIndex] = element;
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
