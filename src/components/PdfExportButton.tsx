import { useState, useCallback } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface PdfExportButtonProps {
  filename?: string;
  selectedLocation?: string;
}

function addWatermark(pdf: jsPDF, pageW: number, pageH: number) {
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  pdf.setTextColor(160, 160, 160);
  pdf.text("Vidák Gábor — Doktori kutatás © 2025", pageW / 2, pageH - 8, { align: "center" });
  pdf.text("Részvételi Filmes Program — Hosszútávú hatásvizsgálat", pageW / 2, pageH - 4, { align: "center" });
  // Reset text color
  pdf.setTextColor(0, 0, 0);
}

export function PdfExportButton({ filename = "impact-dashboard", selectedLocation = "all" }: PdfExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
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
      pdf.text("Részvételi Filmes Program", pageW / 2, pageH / 2 - 16, { align: "center" });
      pdf.text("Hosszútávú hatásvizsgálat", pageW / 2, pageH / 2 - 8, { align: "center" });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Készítette: Vidák Gábor", pageW / 2, pageH / 2 + 8, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("Doktori (PhD) kutatás", pageW / 2, pageH / 2 + 16, { align: "center" });

      pdf.setFontSize(9);
      const locationLabel = selectedLocation === "all" ? "Összes helyszín" : selectedLocation;
      pdf.text(`Szűrő: ${locationLabel}`, pageW / 2, pageH / 2 + 28, { align: "center" });
      pdf.text(`Exportálva: ${new Date().toLocaleDateString("hu-HU")}`, pageW / 2, pageH / 2 + 34, { align: "center" });

      // ── Collect all chart cards and metric cards ──
      const allCards = Array.from(document.querySelectorAll(".chart-card, .metric-card, [data-pdf-section] > .mb-6")) as HTMLElement[];
      
      // Group: get section headers and their charts
      const sections = document.querySelectorAll("[data-pdf-section]");
      
      for (const section of Array.from(sections)) {
        const sectionEl = section as HTMLElement;
        
        // Get section header
        const header = sectionEl.querySelector(".mb-6") as HTMLElement;
        
        // Get metric cards row
        const metricRow = sectionEl.querySelector(".grid.grid-cols-2, .grid.grid-cols-1.md\\:grid-cols-4") as HTMLElement;
        
        // Get all chart cards in this section
        const charts = Array.from(sectionEl.querySelectorAll(".chart-card")) as HTMLElement[];
        
        // Capture header + metrics together if they exist
        if (header || metricRow) {
          const headerElements: HTMLElement[] = [];
          if (header) headerElements.push(header);
          if (metricRow) headerElements.push(metricRow);
          
          // Create a wrapper to capture them together
          const wrapper = document.createElement("div");
          wrapper.style.cssText = "position:absolute;left:-9999px;top:0;width:800px;background:#fff;padding:16px;";
          document.body.appendChild(wrapper);
          
          for (const el of headerElements) {
            wrapper.appendChild(el.cloneNode(true));
          }
          
          try {
            const dataUrl = await toPng(wrapper, {
              backgroundColor: "#ffffff",
              pixelRatio: 1.5,
              quality: 0.85,
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
            const imgH = imgW / imgRatio;
            pdf.addImage(dataUrl, "JPEG", margin, margin, imgW, Math.min(imgH, pageH - margin * 2), undefined, "MEDIUM");
          } catch (e) {
            console.warn("Header capture failed:", e);
          }
          
          document.body.removeChild(wrapper);
        }
        
        // Capture each chart card individually
        for (const chart of charts) {
          try {
            const dataUrl = await toPng(chart, {
              backgroundColor: "#ffffff",
              pixelRatio: 1.5,
              filter: (node) => {
                if (node instanceof HTMLElement && node.dataset.pdfExclude === "true") return false;
                // Exclude PNG download buttons
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
            
            // If image is taller than page, scale down
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
      setExporting(false);
    }
  }, [filename, selectedLocation]);

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
