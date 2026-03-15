import { useState, useCallback } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface PdfExportButtonProps {
  sectionIds: string[];
  filename?: string;
}

export function PdfExportButton({ sectionIds, filename = "impact-dashboard" }: PdfExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableW = pageW - margin * 2;

      // Title page
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("Impact Dashboard", pageW / 2, pageH / 2 - 15, { align: "center" });
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Részvételi Filmes Program — Hosszútávú hatásvizsgálat", pageW / 2, pageH / 2, { align: "center" });
      pdf.setFontSize(10);
      pdf.text(`Exportálva: ${new Date().toLocaleDateString("hu-HU")}`, pageW / 2, pageH / 2 + 12, { align: "center" });

      // Capture each section
      for (const sectionId of sectionIds) {
        const el = document.querySelector(`[data-pdf-section="${sectionId}"]`) as HTMLElement;
        if (!el) continue;

        const dataUrl = await toPng(el, {
          backgroundColor: "#ffffff",
          pixelRatio: 2,
          filter: (node) => {
            // Exclude export buttons from the capture
            if (node instanceof HTMLElement && node.dataset.pdfExclude === "true") return false;
            return true;
          },
        });

        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = dataUrl;
        });

        const imgRatio = img.width / img.height;
        let imgW = usableW;
        let imgH = imgW / imgRatio;

        // If image is taller than one page, split across multiple pages
        if (imgH > pageH - margin * 2) {
          // Scale to fit width and paginate
          const scale = usableW / img.width;
          const totalH = img.height * scale;
          const pageContentH = pageH - margin * 2;
          let yOffset = 0;

          while (yOffset < totalH) {
            pdf.addPage("a4", "landscape");
            // We add the full image but offset it vertically using the y parameter
            pdf.addImage(dataUrl, "PNG", margin, margin - yOffset, imgW, totalH);
            yOffset += pageContentH;
            if (yOffset < totalH) {
              // clip is handled by page boundaries
            }
          }
        } else {
          pdf.addPage("a4", "landscape");
          pdf.addImage(dataUrl, "PNG", margin, margin, imgW, imgH);
        }
      }

      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [sectionIds, filename]);

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
