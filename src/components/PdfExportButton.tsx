import { useState, useCallback } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface PdfExportButtonProps {
  filename?: string;
  selectedLocation?: string;
  onBeforeExport?: () => Promise<void>;
  onAfterExport?: () => void;
}

function addWatermark(pdf: jsPDF, pageW: number, pageH: number) {
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  pdf.setTextColor(160, 160, 160);
  pdf.text("Vidak Gabor - Doktori kutatas (c) 2025", pageW / 2, pageH - 8, { align: "center" });
  pdf.text("Reszveteli Filmes Program - Hosszutavu hatasvizsgalat", pageW / 2, pageH - 4, { align: "center" });
  pdf.setTextColor(0, 0, 0);
}

export function PdfExportButton({ filename = "impact-dashboard", selectedLocation = "all", onBeforeExport, onAfterExport }: PdfExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      // Show all sections before export
      if (onBeforeExport) await onBeforeExport();

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const usableW = pageW - margin * 2;

      // ── Title page ──
      addWatermark(pdf, pageW, pageH);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.text("Impact Dashboard", pageW / 2, pageH / 2 - 30, { align: "center" });

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Reszveteli Filmes Program", pageW / 2, pageH / 2 - 16, { align: "center" });
      pdf.text("Hosszutavu hatasvizsgalat", pageW / 2, pageH / 2 - 8, { align: "center" });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Keszitette: Vidak Gabor", pageW / 2, pageH / 2 + 8, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("Doktori (PhD) kutatas", pageW / 2, pageH / 2 + 16, { align: "center" });

      pdf.setFontSize(9);
      const locationLabel = selectedLocation === "all" ? "Osszes helyszin" : selectedLocation;
      pdf.text(`Szuro: ${locationLabel}`, pageW / 2, pageH / 2 + 28, { align: "center" });
      const dateStr = new Date().toLocaleDateString("hu-HU");
      pdf.text(`Exportalva: ${dateStr}`, pageW / 2, pageH / 2 + 34, { align: "center" });

      pdf.setFontSize(8);
      pdf.text("Tartalomjegyzek: Hatranyos helyzetu fiatalok, ELTE hallgatok,", pageW / 2, pageH / 2 + 48, { align: "center" });
      pdf.text("Osszehasonlitas, Nyitott kerdesek, Elfogadas es Jovokep", pageW / 2, pageH / 2 + 53, { align: "center" });

      // ── Collect ALL sections ──
      const sections = document.querySelectorAll("[data-pdf-section]");

      const sectionNames: Record<string, string> = {
        youth: "Hatranyos helyzetu fiatalok",
        organizer: "ELTE hallgatok (szervezok)",
        comparison: "Osszehasonlitas",
        openended: "Nyitott kerdesek",
        "acceptance-future": "Elfogadas es Jovokep",
      };

      for (const section of Array.from(sections)) {
        const sectionEl = section as HTMLElement;
        const sectionId = sectionEl.dataset.pdfSection || "";
        const sectionTitle = sectionNames[sectionId] || sectionId;

        // Get section header
        const header = sectionEl.querySelector(".mb-6") as HTMLElement;
        const metricRow = sectionEl.querySelector(".grid") as HTMLElement;

        // Capture header + metrics
        if (header || metricRow) {
          const wrapper = document.createElement("div");
          wrapper.style.cssText = "position:absolute;left:-9999px;top:0;width:800px;background:#fff;padding:16px;";
          document.body.appendChild(wrapper);

          if (header) wrapper.appendChild(header.cloneNode(true));
          if (metricRow) wrapper.appendChild(metricRow.cloneNode(true));

          try {
            const dataUrl = await toPng(wrapper, { backgroundColor: "#ffffff", pixelRatio: 1.5 });
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = dataUrl;
            });

            pdf.addPage("a4", "portrait");
            addWatermark(pdf, pageW, pageH);

            // Section title
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text(sectionTitle, pageW / 2, margin + 4, { align: "center" });

            const imgRatio = img.width / img.height;
            const imgW = usableW;
            const imgH = imgW / imgRatio;
            const yStart = margin + 10;
            pdf.addImage(dataUrl, "JPEG", margin, yStart, imgW, Math.min(imgH, pageH - yStart - margin), undefined, "MEDIUM");
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
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = dataUrl;
            });

            pdf.addPage("a4", "portrait");
            addWatermark(pdf, pageW, pageH);

            const imgRatio = img.width / img.height;
            const imgW = usableW;
            let imgH = imgW / imgRatio;

            if (imgH > pageH - margin * 2) {
              imgH = pageH - margin * 2;
              const scaledW = imgH * imgRatio;
              pdf.addImage(dataUrl, "JPEG", margin + (usableW - scaledW) / 2, margin, scaledW, imgH, undefined, "MEDIUM");
            } else {
              pdf.addImage(dataUrl, "JPEG", margin, margin, imgW, imgH, undefined, "MEDIUM");
            }
          } catch (e) {
            console.warn("Chart capture failed:", e);
          }
        }
      }

      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      if (onAfterExport) onAfterExport();
      setExporting(false);
    }
  }, [filename, selectedLocation, onBeforeExport, onAfterExport]);

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
