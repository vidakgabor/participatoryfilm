import { useState } from "react";
import { BookOpen, Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const researchTitle = "Részvételi filmes workshopok – Hosszú távú eredmények és utánkövetés";
const researchUrl = "https://vedeshosszu.vidakgabor.hu";
const apaCitation = `Vidák, G. (2026). ${researchTitle} [Interaktív kutatási dashboard]. ${researchUrl}`;

interface ResearchCitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResearchCitationDialog({ open, onOpenChange }: ResearchCitationDialogProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(apaCitation);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setCopyStatus("idle");
      onOpenChange(nextOpen);
    }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-md p-5 sm:p-7">
        <DialogHeader className="pr-6 text-left">
          <DialogTitle className="flex items-center gap-2 leading-snug tracking-normal">
            <BookOpen className="h-5 w-5 shrink-0 text-youth" />
            Hivatkozás a kutatásra
          </DialogTitle>
          <DialogDescription>Doktori kutatás · Hosszú távú utánkövetés · 2026</DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-1 gap-x-5 gap-y-2 text-sm sm:grid-cols-[9rem_1fr]">
          <dt className="font-semibold">Szerző</dt><dd>Vidák Gábor</dd>
          <dt className="font-semibold">Cím</dt><dd>{researchTitle}</dd>
          <dt className="font-semibold">Megjelenés éve</dt><dd>2026</dd>
          <dt className="font-semibold">Forrás típusa</dt>
          <dd>Interaktív kutatási dashboard, doktori disszertációhoz kapcsolódó hosszú távú utánkövetési eredményközlés.</dd>
          <dt className="font-semibold">Elérhetőség</dt>
          <dd><a className="break-words text-youth underline underline-offset-4" href={researchUrl} target="_blank" rel="noopener noreferrer">{researchUrl}</a></dd>
        </dl>

        <section className="border-t border-border pt-4">
          <h2 className="mb-2 text-sm font-semibold">Ajánlott APA 7 hivatkozás</h2>
          <p className="select-text break-words border-l-2 border-youth pl-4 text-sm leading-relaxed">
            Vidák, G. (2026). <em>{researchTitle}</em> [Interaktív kutatási dashboard]. {researchUrl}
          </p>
          <p className="mt-3 text-sm"><span className="font-semibold">Szövegközi hivatkozás:</span> (Vidák, 2026)</p>
          <Button className="mt-3" size="sm" onClick={copyCitation}>
            {copyStatus === "copied" ? <Check /> : <Copy />}
            {copyStatus === "copied" ? "Hivatkozás másolva" : "Hivatkozás másolása"}
          </Button>
          <p role="status" aria-live="polite" className="mt-2 text-xs text-muted-foreground">
            {copyStatus === "copied" && "Az APA 7 hivatkozás a vágólapra került."}
            {copyStatus === "error" && "A másolás nem sikerült. Jelöld ki és másold ki a fenti hivatkozást."}
          </p>
        </section>

        <section className="border-t border-border pt-4">
          <h2 className="mb-2 text-sm font-semibold">Tudományos háttér</h2>
          <p className="text-sm leading-relaxed">A dashboard Vidák Gábor doktori kutatásának 2026-ban közzétett hosszú távú utánkövetési eredményeit mutatja be. A vizsgálat a részvételi filmes workshopok résztvevőinek későbbi tapasztalatait, attitűdjeit és változásmintázatait elemzi. A kutatás hét helyszínen zajlott, az utánkövetési adatfelvételben összesen 120 fő vett részt, köztük 78 hátrányos helyzetű fiatal és 42 ELTE-hallgató.</p>
          <Button variant="link" asChild className="mt-2 h-auto max-w-full whitespace-normal px-0 text-youth">
            <a href="https://vedesrovid.vidakgabor.hu" target="_blank" rel="noopener noreferrer"><ExternalLink />Rövid távú eredmények</a>
          </Button>
        </section>

        <section className="border-t border-border pt-4">
          <h2 className="mb-2 text-sm font-semibold">Tudományos felhasználás</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">A kutatási eredmények tudományos és oktatási célra, megfelelő forrásmegjelöléssel hivatkozhatók. Az interaktív dashboard a doktori kutatás eredményeinek digitális bemutatását szolgálja, nem helyettesíti a teljes disszertációt vagy a lektorált tudományos közleményeket.</p>
        </section>
      </DialogContent>
    </Dialog>
  );
}