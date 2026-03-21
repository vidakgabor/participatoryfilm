import { useState, useCallback } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface PdfExportButtonProps {
  filename?: string;
  selectedLocation?: string;
  onShowAllSections?: (show: boolean) => Promise<void>;
}

const SECTION_NAMES: Record<string, string> = {
  youth: "Hátrányos helyzetű fiatalok",
  organizer: "ELTE hallgatók (szervezők)",
  comparison: "Összehasonlítás",
  openended: "Nyitott kérdések",
  "acceptance-future": "Elfogadás & Jövőkép",
};

function addLandscapeFooter(pdf: jsPDF, pageW: number, pageH: number, sectionName: string) {
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);
  pdf.text(sectionName, 10, pageH - 4);
  pdf.text("Vidák Gábor — Doktori kutatás © 2025", pageW / 2, pageH - 4, { align: "center" });
  pdf.text("Részvételi Filmes Program — Hosszútávú hatásvizsgálat", pageW - 10, pageH - 4, { align: "right" });
  pdf.setTextColor(0, 0, 0);
}

export function PdfExportButton({ filename = "impact-dashboard", selectedLocation = "all", onShowAllSections }: PdfExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      // Show all sections for capture
      if (onShowAllSections) await onShowAllSections(true);

      const locationLabel = selectedLocation === "all" ? "Összes helyszín" : selectedLocation;
      const exportDate = new Date().toLocaleDateString("hu-HU");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pW = pdf.internal.pageSize.getWidth();
      const pH = pdf.internal.pageSize.getHeight();

      // ── Title page (portrait) — rendered as DOM for UTF-8 ──
      const titleEl = document.createElement("div");
      titleEl.style.cssText = `position:absolute;left:-9999px;top:0;width:794px;height:1123px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Source Sans Pro','Inter',sans-serif;color:#1a1a1a;`;
      titleEl.innerHTML = `
        <div style="text-align:center;">
          <h1 style="font-size:40px;font-weight:bold;margin:0 0 12px;">Impact Dashboard</h1>
          <p style="font-size:22px;margin:0 0 4px;color:#444;">Részvételi Filmes Program</p>
          <p style="font-size:22px;margin:0 0 32px;color:#444;">Hosszútávú hatásvizsgálat</p>
          <div style="width:80px;height:2px;background:#059669;margin:0 auto 32px;"></div>
          <p style="font-size:18px;font-weight:bold;margin:0 0 8px;">Készítette: Vidák Gábor</p>
          <p style="font-size:15px;margin:0 0 32px;color:#666;">Doktori (PhD) kutatás</p>
          <p style="font-size:14px;margin:0 0 4px;color:#888;">Szűrő: ${locationLabel}</p>
          <p style="font-size:14px;margin:0;color:#888;">Exportálva: ${exportDate}</p>
        </div>
        <p style="position:absolute;bottom:20px;font-size:10px;color:#bbb;font-style:italic;">Vidák Gábor — Doktori kutatás © 2025 | Részvételi Filmes Program — Hosszútávú hatásvizsgálat</p>
      `;
      document.body.appendChild(titleEl);

      try {
        const titleDataUrl = await toPng(titleEl, { backgroundColor: "#ffffff", pixelRatio: 2 });
        pdf.addImage(titleDataUrl, "PNG", 0, 0, pW, pH);
      } catch (e) {
        console.warn("Title page capture failed:", e);
      }
      document.body.removeChild(titleEl);

      // ── Chart pages (landscape) — all sections ──
      const sections = document.querySelectorAll("[data-pdf-section]");

      for (const section of Array.from(sections)) {
        const sectionEl = section as HTMLElement;
        const sectionId = sectionEl.dataset.pdfSection || "";
        const sectionName = SECTION_NAMES[sectionId] || sectionId;

        // Get header + metrics as first page of section
        const header = sectionEl.querySelector(".mb-6") as HTMLElement;
        const metricRow = sectionEl.querySelector(".grid.grid-cols-1.md\\:grid-cols-4, .grid.grid-cols-2.md\\:grid-cols-4") as HTMLElement;

        if (header || metricRow) {
          const wrapper = document.createElement("div");
          wrapper.style.cssText = "position:absolute;left:-9999px;top:0;width:1100px;background:#fff;padding:24px;font-family:'Source Sans Pro','Inter',sans-serif;";
          if (header) wrapper.appendChild(header.cloneNode(true));
          if (metricRow) wrapper.appendChild(metricRow.cloneNode(true));
          document.body.appendChild(wrapper);

          try {
            const dataUrl = await toPng(wrapper, { backgroundColor: "#ffffff", pixelRatio: 1.5 });
            const img = new Image();
            await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = dataUrl; });

            pdf.addPage("a4", "landscape");
            const lW = pdf.internal.pageSize.getWidth();
            const lH = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const usableW = lW - margin * 2;
            const usableH = lH - margin * 2 - 8;

            const imgRatio = img.width / img.height;
            let imgW = usableW;
            let imgH = imgW / imgRatio;
            if (imgH > usableH) { imgH = usableH; imgW = imgH * imgRatio; }

            const x = margin + (usableW - imgW) / 2;
            pdf.addImage(dataUrl, "JPEG", x, margin, imgW, imgH, undefined, "MEDIUM");
            addLandscapeFooter(pdf, lW, lH, sectionName);
          } catch (e) {
            console.warn("Header capture failed:", e);
          }
          document.body.removeChild(wrapper);
        }

        // Capture each chart card
        const charts = Array.from(sectionEl.querySelectorAll(".chart-card")) as HTMLElement[];
        for (const chart of charts) {
          try {
            const dataUrl = await toPng(chart, {
              backgroundColor: "#ffffff",
              pixelRatio: 1.5,
              filter: (node) => {
                if (node instanceof HTMLElement && node.dataset.pdfExclude === "true") return false;
                if (node instanceof HTMLElement && node.tagName === "BUTTON" && node.title === "Export PNG") return false;
                return true;
              },
            });

            const img = new Image();
            await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = dataUrl; });

            pdf.addPage("a4", "landscape");
            const lW = pdf.internal.pageSize.getWidth();
            const lH = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const usableW = lW - margin * 2;
            const usableH = lH - margin * 2 - 8;

            const imgRatio = img.width / img.height;
            let imgW = usableW;
            let imgH = imgW / imgRatio;
            if (imgH > usableH) { imgH = usableH; imgW = imgH * imgRatio; }

            const x = margin + (usableW - imgW) / 2;
            const y = margin + (usableH - imgH) / 2;
            pdf.addImage(dataUrl, "JPEG", x, y, imgW, imgH, undefined, "MEDIUM");
            addLandscapeFooter(pdf, lW, lH, sectionName);
          } catch (e) {
            console.warn("Chart capture failed:", e);
          }
        }
      }

      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      if (onShowAllSections) await onShowAllSections(false);
      setExporting(false);
    }
  }, [filename, selectedLocation, onShowAllSections]);

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      data-pdf-exclude="true"
      className="w-full flex items-center justify-center gap-2 text-xs font-medium rounded px-3 py-2 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors disabled:opacity-50"
    >
      {exporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Exportálás...</span>
        </>
      ) : (
        <>
          <FileDown className="w-3.5 h-3.5" />
          <span>PDF Export</span>
        </>
      )}
    </button>
  );
}
