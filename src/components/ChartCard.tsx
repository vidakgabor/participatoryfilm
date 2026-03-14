import { useRef, useCallback } from "react";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";

interface ChartCardProps {
  title: string;
  insight?: string;
  children: React.ReactNode;
  id?: string;
  insightVariant?: "youth" | "organizer";
}

export function ChartCard({ title, insight, children, id, insightVariant = "youth" }: ChartCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(() => {
    if (!ref.current) return;
    toPng(ref.current, { backgroundColor: "#ffffff", pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${id || "chart"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(console.error);
  }, [id]);

  return (
    <div ref={ref} className="chart-card">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-primary">{title}</h3>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded border border-border"
          title="Export PNG"
        >
          <Download className="w-3 h-3" />
          <span>PNG</span>
        </button>
      </div>
      {children}
      {insight && (
        <div className={insightVariant === "organizer" ? "insight-box-green" : "insight-box"}>
          <span className="font-semibold text-foreground">Kulcseredmény: </span>
          {insight}
        </div>
      )}
    </div>
  );
}
